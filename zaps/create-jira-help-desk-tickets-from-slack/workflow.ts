import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SLACK_CHANNEL_ID,
  JIRA_PROJECT_ID,
  JIRA_ISSUE_TYPE_ID,
  JIRA_LABEL,
  SUMMARY_LENGTH,
} from "./config.ts";

const sdk = createZapierSdk();

const InputSchema = z
  .object({
    ts: z.string(),
    thread_ts: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
    user: z
      .object({
        name: z.string().nullable().optional(),
        real_name: z.string().nullable().optional(),
      })
      .loose()
      .nullable()
      .optional(),
  })
  .loose();

const workflow = defineDurable(
  "create-jira-help-desk-tickets-from-slack",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    // Replies inside a thread follow up a request that already has a ticket.
    if (input.thread_ts && input.thread_ts !== input.ts) {
      return { skipped: true, reason: "threaded-reply", ts: input.ts };
    }

    const text = (input.text ?? "").trim();
    if (!text) {
      return { skipped: true, reason: "no-text", ts: input.ts };
    }

    const reporter = input.user?.real_name ?? input.user?.name ?? "unknown";
    const summary = text.split("\n")[0].slice(0, SUMMARY_LENGTH);

    const issue = await ctx.step(`create-jira-ticket-${input.ts}`, async () =>
      sdk.runAction({
        appKey: "jira-software-cloud",
        actionType: "write",
        actionKey: "create_issue",
        connection: "jira-software-cloud",
        inputs: {
          project: JIRA_PROJECT_ID,
          issuetype: JIRA_ISSUE_TYPE_ID,
          rich_text_format: "wiki",
          "string::summary": summary,
          "string::description": `Reported by ${reporter} in Slack.\n\n{quote}\n${text}\n{quote}`,
          "array::labels": [JIRA_LABEL],
        },
      }),
    );

    const created = issue.data[0] as { key: string; self: string };
    // The API URL's origin is the Jira site; the browse path is the page people open.
    const ticketUrl = `${new URL(created.self).origin}/browse/${created.key}`;

    const reply = await ctx.step(`reply-slack-thread-${input.ts}`, async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: SLACK_CHANNEL_ID,
          thread_ts: input.ts,
          text: `Thanks, we've logged this as ${created.key} for the IT team: ${ticketUrl}`,
        },
      }),
    );

    return {
      ts: input.ts,
      ticket: created.key,
      url: ticketUrl,
      reply: reply.data[0] ?? null,
    };
  },
);

export default workflow;
