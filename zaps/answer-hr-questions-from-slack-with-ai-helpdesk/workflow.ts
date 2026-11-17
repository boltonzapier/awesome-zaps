import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SLACK_CHANNEL_ID,
  FAQ_TABLE_ID,
  REQUEST_TABLE_ID,
  MODEL_ID,
  FAQ_QUESTION_FIELD,
  FAQ_ANSWER_FIELD,
  REQUEST_TEXT_FIELD,
  REQUESTER_EMAIL_FIELD,
  ESCALATE_FIELD,
  AI_ANSWER_FIELD,
  MESSAGE_URL_FIELD,
  MESSAGE_TS_FIELD,
  REPORTER_ID_FIELD,
  CREATED_FIELD,
  DEFLECTED_FIELD,
} from "./config.ts";

const sdk = createZapierSdk();

// The model is told to answer with this exact phrase when the FAQs do not cover the question.
const NO_ANSWER = "NO RESPONSE";

const INSTRUCTIONS = `You are the HR help desk assistant. Answer the employee's question using only the FAQ entries supplied. Keep the answer short and friendly. Never guess at policy, pay, or anything about an individual employee. If the FAQ entries do not clearly answer the question, reply with exactly: ${NO_ANSWER}`;

const ACKNOWLEDGEMENT = "Processing your request, hang tight!";
const ESCALATION_REPLY =
  "Hi! HR Helpdesk Bot here. I'm trained on our HR FAQs to help you find quick answers.\n\nUnfortunately, I don't have information on this topic. I've escalated your request to the HR team for further assistance.";

// The message as the Slack channel trigger delivers it. Only the fields this zap reads are named.
const InputSchema = z
  .object({
    ts: z.string(),
    thread_ts: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
    permalink: z.string().nullable().optional(),
    user: z
      .object({
        id: z.string().nullable().optional(),
        profile: z
          .object({ email: z.string().nullable().optional() })
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
  "answer-hr-questions-from-slack-with-ai-helpdesk",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    // Replies inside a thread follow up a question that was already handled.
    if (input.thread_ts && input.thread_ts !== input.ts) {
      return { skipped: true, reason: "threaded-reply", ts: input.ts };
    }

    const question = (input.text ?? "").trim();
    if (!question) {
      return { skipped: true, reason: "no-text", ts: input.ts };
    }

    const reporterId = input.user?.id ?? "";
    const reporterEmail = input.user?.profile?.email ?? "";

    await ctx.step(`acknowledge-in-thread-${input.ts}`, async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: SLACK_CHANNEL_ID,
          thread_ts: input.ts,
          text: ACKNOWLEDGEMENT,
        },
      }),
    );

    const faqRows = await ctx.step(`load-hr-faqs-${input.ts}`, async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "search",
        actionKey: "find_records",
        connection: "zapier-tables",
        inputs: {
          table_id: FAQ_TABLE_ID,
          filter_count: "1",
          field_data_key: `data__${FAQ_QUESTION_FIELD}`,
          operator: "different",
          lookup_value: "lookup all options",
        },
      }),
    );

    const faqs = faqRows.data
      .map((row) => {
        const record = row as Record<string, string | null | undefined>;
        return `Q: ${record[`data__${FAQ_QUESTION_FIELD}`] ?? ""}\nA: ${record[`data__${FAQ_ANSWER_FIELD}`] ?? ""}`;
      })
      .join("\n\n");

    const completion = await ctx.step(
      `answer-from-faqs-${input.ts}`,
      async () =>
        sdk.runAction({
          appKey: "ai",
          actionType: "write",
          actionKey: "get_completion",
          inputs: {
            model_id: MODEL_ID,
            authentication_id: "0",
            instructions: INSTRUCTIONS,
            inputFields: { question, faqs },
            includeWorkflowData: false,
            outputFields: [{ name: "answer", type: "text", isRequired: true }],
          },
        }),
    );

    const answer = String(
      (completion.data[0] as { answer?: string } | undefined)?.answer ?? "",
    ).trim();
    const answered = !answer.includes(NO_ANSWER);

    await ctx.step(`log-request-${input.ts}`, async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: REQUEST_TABLE_ID,
          [`new__data__${REQUEST_TEXT_FIELD}`]: question,
          [`new__data__${REQUESTER_EMAIL_FIELD}`]: reporterEmail,
          [`new__data__${ESCALATE_FIELD}`]: !answered,
          [`new__data__${AI_ANSWER_FIELD}`]: answered ? answer : "",
          [`new__data__${MESSAGE_URL_FIELD}`]: input.permalink ?? "",
          [`new__data__${MESSAGE_TS_FIELD}`]: input.ts,
          [`new__data__${REPORTER_ID_FIELD}`]: reporterId
            ? `<@${reporterId}>`
            : "",
          [`new__data__${CREATED_FIELD}`]: "@now",
          [`new__data__${DEFLECTED_FIELD}`]: answered,
        },
      }),
    );

    const reply = await ctx.step(`reply-in-thread-${input.ts}`, async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: SLACK_CHANNEL_ID,
          thread_ts: input.ts,
          text: answered ? `>${answer}` : ESCALATION_REPLY,
        },
      }),
    );

    return {
      ts: input.ts,
      escalated: !answered,
      reply: reply.data[0] ?? null,
    };
  },
);

export default workflow;
