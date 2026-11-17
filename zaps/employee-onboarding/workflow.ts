import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  NOTIFY_EMAIL,
  FROM_NAME,
  EMAIL_FIELD,
  URGENCY_FIELD,
} from "./config.ts";

const sdk = createZapierSdk();

const InputSchema = z
  .object({
    record_id: z.union([z.string(), z.number()]),
    new: z
      .object({
        data: z
          .object({
            f1: z.string().nullable().optional(),
            f2: z.string().nullable().optional(),
          })
          .loose(),
      })
      .loose(),
  })
  .loose();

const workflow = defineDurable("employee-onboarding", async (ctx, rawInput) => {
  const input = InputSchema.parse(
    typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
  );
  const requester = (input.new.data[EMAIL_FIELD] ?? "").trim();
  const urgency = (input.new.data[URGENCY_FIELD] ?? "").trim();

  const body = [
    `Submitted by: ${requester}`,
    `Urgency: ${urgency}`,
    "",
    `View details for all requests in table here: https://tables.zapier.com/app/tables/t/${TABLE_ID}`,
  ].join("\n");

  const sent = await ctx.step("send-help-request-email", async () =>
    sdk.runAction({
      appKey: "email",
      actionType: "write",
      actionKey: "outbound",
      inputs: {
        to: NOTIFY_EMAIL,
        subject: "New help request submitted",
        body,
        from_name: FROM_NAME,
      },
    }),
  );

  return {
    recordId: input.record_id,
    sent: sent.data[0] ?? null,
  };
});

export default workflow;
