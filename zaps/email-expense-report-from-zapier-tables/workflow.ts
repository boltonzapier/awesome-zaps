import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  FINANCE_EMAIL,
  EMAIL_SUBJECT,
  EMAIL_FROM_NAME,
  PENDING_STATUS,
  DESCRIPTION_FIELD,
  CATEGORY_FIELD,
  AMOUNT_FIELD,
  STATUS_FIELD,
  DATE_FIELD,
} from "./config.ts";

const sdk = createZapierSdk();

// The clicked record as the button trigger delivers it: its ID, and its field values under new.data.
const InputSchema = z
  .object({
    record_id: z.string(),
    new: z
      .object({
        data: z.record(z.string(), z.unknown()),
      })
      .loose(),
  })
  .loose();

const workflow = defineDurable(
  "email-expense-report-from-zapier-tables",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const row = input.new.data;

    const text = (key: string) => {
      const value = row[key];
      return value === null || value === undefined ? "" : String(value);
    };

    // The status is written first so the row already reads Pending when the email goes out.
    const updated = await ctx.step("update-status-to-pending", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "update_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          record_id: input.record_id,
          [`new__data__${STATUS_FIELD}`]: PENDING_STATUS,
        },
      }),
    );

    const body = [
      "Hi,",
      "",
      "A new expense was submitted for reimbursement.",
      "",
      "Details of the expense:",
      `Description: ${text(DESCRIPTION_FIELD)}`,
      `Category: ${text(CATEGORY_FIELD)}`,
      `Amount: ${text(AMOUNT_FIELD)}`,
      `Date: ${text(DATE_FIELD)}`,
      `Status: ${PENDING_STATUS}`,
      "",
      "Thanks!",
    ].join("\n");

    const sent = await ctx.step("send-expense-email", async () =>
      sdk.runAction({
        appKey: "email",
        actionType: "write",
        actionKey: "outbound",
        connection: "email",
        inputs: {
          to: FINANCE_EMAIL,
          subject: EMAIL_SUBJECT,
          from_name: EMAIL_FROM_NAME,
          body,
        },
      }),
    );

    return {
      recordId: input.record_id,
      status: PENDING_STATUS,
      updated: updated.data?.[0] ?? null,
      email: sent.data?.[0] ?? null,
    };
  },
);

export default workflow;
