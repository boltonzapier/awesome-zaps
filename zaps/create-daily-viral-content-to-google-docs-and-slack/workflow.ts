import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  BUSINESS_NICHE,
  DOC_TITLE_PREFIX,
  MODEL_ID,
  SHARING_PREFERENCE,
  SLACK_RECIPIENT_ID,
} from "./config.ts";

const sdk = createZapierSdk();

// The daily schedule trigger sends nothing the zap reads; the schema only checks that the input parses.
const InputSchema = z.object({}).loose();

// One prompt covers research, scripting and engagement so the whole document is written in one AI call.
function buildPrompt(niche: string): string {
  return `You are a content automation agent. Your goal is to research trending topics in ${niche}, create viral video scripts and supporting assets, set up engagement automation, and deliver everything as one document.

1. Topic research and selection
- Identify 3 topics in ${niche} that are trending right now.
- Judge each one's viral potential for a short-form TikTok video and for a long-form video.
- Select the strongest topic and use it for everything below.

2. Content scripting
- Write a 5-second attention-grabbing hook that is controversial or viral.
- Write an 80-second short video script with clear value, storytelling and a call to action.
- Expand into a 5-minute long-form video script with full sentences, b-roll shot suggestions and filming instructions.
- Write a caption for each video with up to 6 relevant hashtags.
- Write a 2-paragraph direct-response newsletter post that promotes the videos.

3. Engagement automation
- Choose one engagement keyword that viewers can comment to receive more.
- Draft 3 automated reply templates for that keyword, each with a call to action.
- Outline a daily SOP for creating and posting this content.

Write the whole output as plain text, with one heading per section and no commentary outside the document.`;
}

const workflow = defineDurable(
  "create-daily-viral-content-to-google-docs-and-slack",
  async (ctx, rawInput) => {
    InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const today = await ctx.step("capture-date", async () =>
      new Date().toISOString().slice(0, 10),
    );

    const draft = await ctx.step("draft-viral-content", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: MODEL_ID,
          authentication_id: "0",
          instructions: buildPrompt(BUSINESS_NICHE),
          includeWorkflowData: false,
          outputFields: [{ name: "document", type: "text", isRequired: true }],
        },
      }),
    );

    const document = String(
      (draft.data[0] as { document?: unknown } | undefined)?.document ?? "",
    ).trim();
    if (!document) {
      throw new Error("The AI step returned no content");
    }

    const created = await ctx.step("create-content-doc", async () =>
      sdk.runAction({
        appKey: "google-docs",
        actionType: "write",
        actionKey: "newtxtdocument",
        connection: "google-docs",
        inputs: {
          title: `${DOC_TITLE_PREFIX} ${today}`,
          file: document,
        },
      }),
    );

    const docId = (created.data[0] as { id?: string } | undefined)?.id;
    if (!docId) {
      throw new Error("Google Docs did not return the new document's ID");
    }

    await ctx.step("share-content-doc", async () =>
      sdk.runAction({
        appKey: "google-drive",
        actionType: "write",
        actionKey: "share_file",
        connection: "google-drive",
        inputs: {
          file_id: docId,
          permission: SHARING_PREFERENCE,
        },
      }),
    );

    const docUrl = `https://docs.google.com/document/d/${docId}/edit`;

    const message = await ctx.step("send-slack-link", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: SLACK_RECIPIENT_ID,
          text: `Today's viral content is ready: ${docUrl}`,
        },
      }),
    );

    return {
      date: today,
      docId,
      docUrl,
      message: message.data[0] ?? null,
    };
  },
);

export default workflow;
