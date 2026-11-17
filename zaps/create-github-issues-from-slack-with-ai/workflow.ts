import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { GITHUB_REPO, MODEL_ID } from "./config.ts";

const sdk = createZapierSdk();

// The message a teammate pushes to the Zapier bot in Slack, with the fields the trigger's enrichments add.
const InputSchema = z
  .object({
    message: z
      .object({
        ts: z.string(),
        thread_ts: z.string().nullable().optional(),
        raw_text: z.string().nullable().optional(),
        permalink: z.string().nullable().optional(),
        user: z
          .object({
            name: z.string().nullable().optional(),
            real_name: z.string().nullable().optional(),
          })
          .loose()
          .nullable()
          .optional(),
        channel: z.object({
          id: z.string(),
          name: z.string().nullable().optional(),
        }),
      })
      .loose(),
  })
  .loose();

const INSTRUCTIONS = `You turn a Slack message into a GitHub issue, written the way a product manager would write it. Keep it simple and make few assumptions: use only what the message says.

Read the Slack message in slack_message. slack_author and slack_channel say who wrote it and where.

Return:
- title: a concise, descriptive title of at most 80 characters.
- description: markdown in this layout, filled in from the message. Where the message describes a user story, write it in Gherkin (Given, When, Then).

# Problem Definition
A concise and clear description of the problem.

# Proposed Solution
A concise and clear description of the proposed solution.

# Tasks
- [ ] One line per action item the message asks for, and nothing it does not ask for.`;

const workflow = defineDurable(
  "create-github-issues-from-slack-with-ai",
  async (ctx, rawInput) => {
    const { message } = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    // Replies inside a thread follow up a request that is already tracked.
    if (message.thread_ts && message.thread_ts !== message.ts) {
      return { skipped: true, reason: "threaded-reply", ts: message.ts };
    }

    const text = (message.raw_text ?? "").trim();
    if (!text) {
      return { skipped: true, reason: "no-text", ts: message.ts };
    }

    const author = message.user?.real_name ?? message.user?.name ?? "unknown";
    const permalink = message.permalink ?? "";

    const draft = await ctx.step("draft-issue-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: MODEL_ID,
          authentication_id: "0",
          includeWorkflowData: false,
          instructions: INSTRUCTIONS,
          inputFields: {
            slack_message: text,
            slack_author: author,
            slack_channel: message.channel.name ?? "",
          },
          outputFields: [
            { name: "title", type: "text", isRequired: true },
            { name: "description", type: "text", isRequired: true },
          ],
        },
      }),
    );

    const drafted = draft.data[0] as { title: string; description: string };
    // The Meta block is added here, not by the model, so the link and author are exact.
    const body = `${drafted.description}\n\n# Meta\n- [Link to Slack conversation](${permalink})\n- Author: ${author}`;

    const issue = await ctx.step("create-github-issue", async () =>
      sdk.runAction({
        appKey: "github",
        actionType: "write",
        actionKey: "issue",
        connection: "github",
        inputs: {
          repo: GITHUB_REPO,
          title: drafted.title.slice(0, 80),
          body,
        },
      }),
    );

    const created = issue.data[0] as { html_url: string };

    const reply = await ctx.step("reply-slack-thread", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: message.channel.id,
          thread_ts: message.ts,
          text: `GitHub issue created: ${created.html_url}`,
        },
      }),
    );

    return {
      ts: message.ts,
      issue: created.html_url,
      reply: reply.data[0] ?? null,
    };
  },
);

export default workflow;
