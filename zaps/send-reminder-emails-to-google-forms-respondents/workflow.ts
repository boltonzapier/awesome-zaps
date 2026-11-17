import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { EMAIL_FIELD, EMAIL_SUBJECT, EMAIL_BODY } from "./config.ts";

const sdk = createZapierSdk();

const AnswersSchema = z.record(z.string(), z.unknown());

const workflow = defineDurable(
  "send-reminder-emails-to-google-forms-respondents",
  async (ctx, rawInput) => {
    const answers = AnswersSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const rawAddress = answers[EMAIL_FIELD];
    const address = typeof rawAddress === "string" ? rawAddress.trim() : "";
    if (!address) {
      return { skipped: true, reason: "no-email-answer" };
    }

    const sent = await ctx.step("send-reminder-email", async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "write",
        actionKey: "message",
        connection: "gmail",
        inputs: {
          to: [address],
          subject: EMAIL_SUBJECT,
          body: EMAIL_BODY,
          body_type: "plain",
        },
      }),
    );

    return { sent: true, sentId: sent.data?.[0] ?? null };
  },
);

export default workflow;
