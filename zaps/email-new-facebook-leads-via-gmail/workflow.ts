import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { NOTIFY_EMAIL, SUBJECT_PREFIX } from "./config.ts";

const sdk = createZapierSdk();

// The new lead as the Facebook Lead Ads trigger delivers it. Standard questions arrive in
// uppercase keys; a form's custom questions use the key the form defines.
const InputSchema = z
  .object({
    id: z.string(),
    created_time: z.string().nullable().optional(),
    FULL_NAME: z.string().nullable().optional(),
    EMAIL: z.string().nullable().optional(),
    PHONE_NUMBER: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "email-new-facebook-leads-via-gmail",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const name = (input.FULL_NAME ?? "").trim() || "Unnamed lead";
    const email = (input.EMAIL ?? "").trim();
    const phone = (input.PHONE_NUMBER ?? "").trim();

    const body = [
      `Name: ${name}`,
      `Email: ${email}`,
      `Phone: ${phone}`,
      `Submitted: ${input.created_time ?? "unknown"}`,
      `Lead ID: ${input.id}`,
    ].join("\n");

    const sent = await ctx.step(`send-lead-email-${input.id}`, async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "write",
        actionKey: "message",
        connection: "gmail",
        inputs: {
          to: NOTIFY_EMAIL,
          subject: `${SUBJECT_PREFIX}: ${name}`,
          body,
          // Replying goes straight to the lead, when the form gave an address.
          ...(email ? { reply_to: email } : {}),
        },
      }),
    );

    return {
      leadId: input.id,
      sent: sent.data[0] ?? null,
    };
  },
);

export default workflow;
