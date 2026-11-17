import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  REPORT_EMAIL,
  DATE_FIELD,
  PRODUCT_NAME_FIELD,
  QUANTITY_SOLD_FIELD,
  SALES_REVENUE_FIELD,
  CUSTOMER_FEEDBACK_FIELD,
  EMAIL_SUBJECT,
  EMAIL_FROM_NAME,
} from "./config.ts";

const sdk = createZapierSdk();

// The button's record arrives as a flat object keyed by the table's field keys.
const InputSchema = z.record(z.string(), z.unknown());

const workflow = defineDurable(
  "email-daily-sales-report-from-zapier-tables",
  async (ctx, rawInput) => {
    const record = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const text = (key: string) => {
      const value = record[key];
      return value === null || value === undefined ? "" : String(value);
    };

    const body = [
      `Date: ${text(DATE_FIELD)}`,
      `Product Name: ${text(PRODUCT_NAME_FIELD)}`,
      `Quantity Sold: ${text(QUANTITY_SOLD_FIELD)}`,
      `Sales Revenue: ${text(SALES_REVENUE_FIELD)}`,
      `Customer Feedback: ${text(CUSTOMER_FEEDBACK_FIELD)}`,
    ].join("\n");

    const sent = await ctx.step("send-report-email", async () =>
      sdk.runAction({
        appKey: "email",
        actionType: "write",
        actionKey: "outbound",
        connection: "email",
        inputs: {
          to: REPORT_EMAIL,
          subject: EMAIL_SUBJECT,
          from_name: EMAIL_FROM_NAME,
          body,
        },
      }),
    );

    return { sent: true, body, result: sent.data?.[0] ?? null };
  },
);

export default workflow;
