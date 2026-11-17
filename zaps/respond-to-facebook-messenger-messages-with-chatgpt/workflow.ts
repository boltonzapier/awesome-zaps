import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  PAGE_ID,
  DEFAULT_MODEL,
  POLL_INTERVAL_SECONDS,
  MAX_POLLS,
  SYSTEM_INSTRUCTIONS,
} from "./config.ts";

const sdk = createZapierSdk();

// The Messenger message as the page trigger delivers it.
const InputSchema = z
  .object({
    text: z.string().nullable().optional(),
    sender__id: z.string().nullable().optional(),
    sender__name: z.string().nullable().optional(),
    // Not confirmed in the trigger's declared output; checked in case Messenger delivers the page's own sends.
    is_echo: z.union([z.boolean(), z.string()]).nullable().optional(),
  })
  .loose();

type ResponseBody = {
  id?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

// Strip control characters that break JSON payloads. The request encoder does the JSON escaping.
function sanitize(text: string | null | undefined): string {
  return (text ?? "")
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
  "respond-to-facebook-messenger-messages-with-chatgpt",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const message = sanitize(input.text);
    const senderId = input.sender__id ?? "";

    // The page's own replies can come back through the trigger; answering them would loop forever.
    const isEcho =
      input.is_echo === true ||
      (typeof input.is_echo === "string" &&
        input.is_echo.toLowerCase() === "true");
    if (isEcho || senderId === PAGE_ID) {
      return { skipped: true, reason: "page-own-message", senderId };
    }

    // Messages without text, such as stickers or photos alone, have nothing for ChatGPT to answer.
    if (!message || !senderId) {
      return { skipped: true, reason: "no-text-or-sender", senderId };
    }

    const submitted = await ctx.step("submit-chatgpt-request", async () =>
      sdk.runAction({
        appKey: "chatgpt",
        actionType: "write",
        actionKey: "conversation_responses_api",
        connection: "chatgpt",
        inputs: {
          model: DEFAULT_MODEL,
          instructions: SYSTEM_INSTRUCTIONS,
          user_message: message,
        },
      }),
    );

    const responseId = (submitted.data[0] as ResponseBody | undefined)?.id;
    if (!responseId) {
      return { ok: false, error: "no-response-id", senderId };
    }

    let reply = "";
    for (let attempt = 1; attempt <= MAX_POLLS && !reply; attempt++) {
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

      reply = outputText(fetched.data[0] as ResponseBody | undefined);
    }

    if (!reply) {
      return {
        ok: false,
        error: "no-content-after-polling",
        responseId,
        senderId,
      };
    }

    const sent = await ctx.step("send-messenger-reply", async () =>
      sdk.runAction({
        appKey: "facebook-messenger",
        actionType: "write",
        actionKey: "send_message",
        connection: "facebook-messenger",
        inputs: {
          recipient: senderId,
          text: reply,
        },
      }),
    );

    return {
      ok: true,
      senderId,
      senderName: input.sender__name ?? null,
      reply,
      sent: sent.data[0] ?? null,
    };
  },
);

export default workflow;
