import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SLACK_CHANNEL_ID,
  FAQ_TABLE_ID,
  FAQ_QUESTION_FIELD,
  FAQ_ANSWER_FIELD,
  HELP_TABLE_ID,
  HELP_REQUEST_FIELD,
  HELP_REQUESTER_FIELD,
  HELP_ESCALATE_FIELD,
  HELP_LINK_FIELD,
  HELP_THREAD_FIELD,
  MODEL_ID,
  MAX_FAQ_CHARS,
} from "./config.ts";

const sdk = createZapierSdk();

const INSTRUCTIONS = `You answer questions from employees in an internal help channel. Use only the FAQ records supplied in inputFields.faq.

Set found to Yes only when the FAQ clearly answers the request. If it does not, or only partly does, set found to No and leave answer empty. Never guess at policies, dates, prices, account details or who approves what.

When found is Yes, write answer as a short, friendly reply in plain text that the employee can act on. Reuse the FAQ wording where it helps.`;

// The Slack message as the channel trigger delivers it.
const InputSchema = z
  .object({
    ts: z.string(),
    thread_ts: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
    permalink: z.string().nullable().optional(),
    user: z
      .object({
        profile: z
          .object({
            email: z.string().nullable().optional(),
          })
          .loose()
          .nullable()
          .optional(),
      })
      .loose()
      .nullable()
      .optional(),
  })
  .loose();

const workflow = defineDurable(
  "answer-slack-faqs-and-log-requests-with-ai",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    // Replies inside a thread are follow-ups, not new questions.
    if (input.thread_ts && input.thread_ts !== input.ts) {
      return { skipped: true, reason: "threaded-reply", ts: input.ts };
    }

    const question = (input.text ?? "").trim();
    if (!question) {
      return { skipped: true, reason: "no-text", ts: input.ts };
    }

    const faq = await ctx.step("read-faq-records", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "search",
        actionKey: "find_records",
        connection: "zapier-tables",
        inputs: {
          table_id: FAQ_TABLE_ID,
          filter_count: "1",
          field_data_key: FAQ_QUESTION_FIELD,
          operator: "different",
          lookup_value: "lookup all options",
        },
      }),
    );

    const faqRows = (faq.data ?? []) as Array<{
      data?: Record<string, string | null>;
    }>;
    const faqText = faqRows
      .map(
        (row) =>
          `Q: ${row.data?.[FAQ_QUESTION_FIELD] ?? ""}\nA: ${row.data?.[FAQ_ANSWER_FIELD] ?? ""}`,
      )
      .join("\n\n")
      .slice(0, MAX_FAQ_CHARS);

    const answer = await ctx.step("answer-from-faq", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: MODEL_ID,
          authentication_id: "0",
          instructions: INSTRUCTIONS,
          inputFields: { request: question, faq: faqText },
          includeWorkflowData: false,
          outputFields: [
            {
              name: "found",
              type: "category_single",
              options: ["Yes", "No"],
              isRequired: true,
            },
            { name: "answer", type: "text", isRequired: true },
          ],
        },
      }),
    );

    const result = (answer.data[0] ?? {}) as Record<string, unknown>;
    const found = String(result.found ?? "") === "Yes";
    const responseText = String(result.answer ?? "").trim();

    if (found && responseText) {
      const reply = await ctx.step("reply-slack-thread", async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "write",
          actionKey: "channel_message",
          connection: "slack",
          inputs: {
            channel: SLACK_CHANNEL_ID,
            thread_ts: input.ts,
            text: responseText,
          },
        }),
      );
      return {
        ts: input.ts,
        outcome: "answered",
        reply: reply.data[0] ?? null,
      };
    }

    const request = await ctx.step("log-help-request", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: HELP_TABLE_ID,
          [`new__data__${HELP_REQUEST_FIELD}`]: question,
          [`new__data__${HELP_REQUESTER_FIELD}`]:
            input.user?.profile?.email ?? "",
          [`new__data__${HELP_ESCALATE_FIELD}`]: true,
          [`new__data__${HELP_LINK_FIELD}`]: input.permalink ?? "",
          [`new__data__${HELP_THREAD_FIELD}`]: input.ts,
        },
      }),
    );

    const reply = await ctx.step("reply-slack-thread-escalated", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: SLACK_CHANNEL_ID,
          thread_ts: input.ts,
          text: "I couldn't find an answer in our FAQ, so I've passed this to the support team. They'll follow up in this thread.",
        },
      }),
    );

    return {
      ts: input.ts,
      outcome: "escalated",
      request: request.data[0] ?? null,
      reply: reply.data[0] ?? null,
    };
  },
);

export default workflow;
