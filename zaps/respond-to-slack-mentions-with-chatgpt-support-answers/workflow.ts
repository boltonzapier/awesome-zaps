import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { DEFAULT_MODEL, SUPPORT_INSTRUCTIONS } from "./config.ts";

const sdk = createZapierSdk();

// Seconds to wait before each check of the stored response.
const POLL_INTERVAL_SECONDS = 30;
// Checks before giving up; 20 checks at 30 seconds is ten minutes.
const MAX_POLLS = 20;

const InputSchema = z
  .object({
    ts: z.string(),
    channel: z.string(),
    thread_ts: z.string().nullable().optional(),
    text: z.string().nullable().optional(),
  })
  .loose();

type ResponseBody = {
  id?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

// Slack wraps mentions as <@U…>; the model should see only the question.
// Control characters break JSON payloads, so they are stripped too.
function questionFrom(text: string | null | undefined): string {
  return (text ?? "")
    .replace(/<@[A-Z0-9]+>/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "")
    .trim();
}

function outputText(body: ResponseBody | undefined): string {
  return (body?.output ?? [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter(
      (part) => part.type === "output_text" && typeof part.text === "string",
    )
    .map((part) => part.text)
    .join("")
    .trim();
}

const workflow = defineDurable(
  "respond-to-slack-mentions-with-chatgpt-support-answers",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const question = questionFrom(input.text);
    if (!question) {
      return { skipped: true, reason: "no-text", ts: input.ts };
    }

    const submitted = await ctx.step(
      `submit-chatgpt-request-${input.ts}`,
      async () =>
        sdk.runAction({
          appKey: "chatgpt",
          actionType: "write",
          actionKey: "conversation_responses_api",
          connection: "chatgpt",
          inputs: {
            model: DEFAULT_MODEL,
            instructions: SUPPORT_INSTRUCTIONS,
            user_message: question,
          },
        }),
    );

    const responseId = (submitted.data[0] as ResponseBody | undefined)?.id;
    if (!responseId) {
      return { ok: false, error: "no-response-id", ts: input.ts };
    }

    let answer = "";
    for (let attempt = 1; attempt <= MAX_POLLS && !answer; attempt++) {
      await ctx.wait(`wait-before-poll-${attempt}`, POLL_INTERVAL_SECONDS);

      const fetched = await ctx.step(
        `get-chatgpt-response-${attempt}`,
        async () =>
          sdk.runAction({
            appKey: "chatgpt",
            actionType: "write",
            actionKey: "_zap_raw_request",
            connection: "chatgpt",
            inputs: {
              url: `https://api.openai.com/v1/responses/${responseId}`,
              fail_on_errors: "true",
            },
          }),
      );

      answer = outputText(fetched.data[0] as ResponseBody | undefined);
    }

    if (!answer) {
      return { ok: false, error: "no-content-after-polling", ts: input.ts };
    }

    // Replies stay in the mention's thread; a top-level mention starts one.
    const reply = await ctx.step(`reply-slack-thread-${input.ts}`, async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: input.channel,
          thread_ts: input.thread_ts ?? input.ts,
          text: answer,
        },
      }),
    );

    return {
      ok: true,
      ts: input.ts,
      responseId,
      reply: reply.data[0] ?? null,
    };
  },
);

export default workflow;
