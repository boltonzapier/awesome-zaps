import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  COACHING_TEAM_EMAIL,
  EMAIL_SUBJECT,
  INSTRUCTIONS,
  MAX_RESPONSE_CHARS,
  MODEL,
} from "./config.ts";

const sdk = createZapierSdk();

// The Google Forms response as the trigger delivers it: one entry per question, keyed by the question's title.
const ResponseSchema = z.record(z.string(), z.unknown());

const workflow = defineDurable(
  "summarize-google-forms-responses-with-chatgpt-and-gmail",
  async (ctx, rawInput) => {
    const response = ResponseSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    // Cap the payload so a long form cannot push the request past the model's input limit.
    const responseText = JSON.stringify(response, null, 2).slice(
      0,
      MAX_RESPONSE_CHARS,
    );

    const review = await ctx.step("summarize-response-with-chatgpt", async () =>
      sdk.runAction({
        appKey: "chatgpt",
        actionType: "write",
        actionKey: "conversation_responses_api",
        connection: "chatgpt",
        inputs: {
          model: MODEL,
          instructions: INSTRUCTIONS,
          user_message: `Client questionnaire responses (JSON):\n${responseText}`,
          response_format: "text",
        },
      }),
    );

    const summary = String(
      (review.data?.[0] as { output?: string } | undefined)?.output ?? "",
    ).trim();
    if (!summary) {
      return { skipped: true, reason: "empty-summary" };
    }

    const sent = await ctx.step("email-summary-to-coaching-team", async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "write",
        actionKey: "message",
        connection: "gmail",
        inputs: {
          to: [COACHING_TEAM_EMAIL],
          subject: EMAIL_SUBJECT,
          body: summary,
          body_type: "plain",
        },
      }),
    );

    return { sent: true, sentId: sent.data?.[0] ?? null };
  },
);

export default workflow;
