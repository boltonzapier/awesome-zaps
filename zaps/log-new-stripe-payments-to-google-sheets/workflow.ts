import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  LOGGED_AT_COLUMN,
  PAYMENT_ID_COLUMN,
  CREATED_AT_COLUMN,
  AMOUNT_COLUMN,
  CURRENCY_COLUMN,
  STATUS_COLUMN,
  CUSTOMER_EMAIL_COLUMN,
  DESCRIPTION_COLUMN,
} from "./config.ts";

const sdk = createZapierSdk();

// The completed payment as the Stripe New Payment trigger delivers it. Every field is optional
// because payments differ in what they carry; the row keeps whatever is present.
const InputSchema = z
  .object({
    id: z.string().nullable().optional(),
    created: z.union([z.number(), z.string()]).nullable().optional(),
    amount: z.union([z.number(), z.string()]).nullable().optional(),
    currency: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    customer_email: z.string().nullable().optional(),
  })
  .loose();

// Stripe sends `created` as Unix seconds; the sheet gets an ISO time.
const toIsoTime = (created: number | string | null | undefined): string => {
  if (typeof created === "number")
    return new Date(created * 1000).toISOString();
  return created ?? "";
};

const workflow = defineDurable(
  "log-new-stripe-payments-to-google-sheets",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const loggedAt = await ctx.step("capture-logged-at", async () =>
      new Date().toISOString(),
    );

    const row = await ctx.step("log-payment-row", async () =>
      sdk.runAction({
        appKey: "google-sheets",
        actionType: "write",
        actionKey: "add_row",
        connection: "google-sheets",
        inputs: {
          spreadsheet: SPREADSHEET_ID,
          worksheet: WORKSHEET_ID,
          [LOGGED_AT_COLUMN]: loggedAt,
          [PAYMENT_ID_COLUMN]: input.id ?? "",
          [CREATED_AT_COLUMN]: toIsoTime(input.created),
          [AMOUNT_COLUMN]: String(input.amount ?? ""),
          [CURRENCY_COLUMN]: (input.currency ?? "").toUpperCase(),
          [STATUS_COLUMN]: input.status ?? "",
          [CUSTOMER_EMAIL_COLUMN]: input.customer_email ?? "",
          [DESCRIPTION_COLUMN]: input.description ?? "",
        },
      }),
    );

    return {
      paymentId: input.id ?? null,
      loggedAt,
      row: row.data?.[0] ?? null,
    };
  },
);

export default workflow;
