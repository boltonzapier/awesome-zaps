import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { RECIPIENT_EMAIL, AI_MODEL } from "./config.ts";

const sdk = createZapierSdk();

const InputSchema = z
  .object({
    id: z.string().nullable().optional(),
    message_id: z.string().nullable().optional(),
    from: z
      .object({
        name: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
      })
      .loose()
      .nullable()
      .optional(),
    subject: z.string().nullable().optional(),
    body_plain: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "send-ai-replies-for-new-gmail-emails",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const messageId = input.message_id ?? input.id ?? null;
    if (!messageId) {
      return { skipped: true, reason: "no-message-id" };
    }

    const subject = input.subject ?? "(no subject)";
    const body = (input.body_plain ?? "").trim();
    if (!body) {
      return { skipped: true, reason: "empty-body", messageId };
    }

    const sender = input.from?.name ?? input.from?.email ?? "unknown sender";

    const reply = await ctx.step("generate-reply", async () => {
      const result = await sdk.runAction({
        appKey: "google-ai-studio",
        actionType: "write",
        actionKey: "send_prompt",
        connection: "google-ai-studio",
        inputs: {
          model: AI_MODEL,
          prompt: [
            "Write a thoughtful, concise and professional reply to the email below. Return only the reply text, with no subject line and no signature.",
            "",
            `From: ${sender}`,
            `Subject: ${subject}`,
            "",
            body,
          ].join("\n"),
        },
      });
      const output = result.data?.[0] as { output?: string } | undefined;
      return (output?.output ?? "").trim();
    });

    if (!reply) {
      return { skipped: true, reason: "empty-reply", messageId };
    }

    const sent = await ctx.step("send-reply-email", async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "write",
        actionKey: "message",
        connection: "gmail",
        inputs: {
          to: [RECIPIENT_EMAIL],
          subject: `Suggested reply: ${subject}`,
          body: `Reply to ${sender}:\n\n${reply}`,
          body_type: "plain",
        },
      }),
    );

    return {
      messageId,
      sentTo: RECIPIENT_EMAIL,
      reply,
      sent: sent.data?.[0] ?? null,
    };
  },
);

export default workflow;
