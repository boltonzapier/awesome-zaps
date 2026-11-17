import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  LOGGED_AT_COLUMN,
  ORDER_ID_COLUMN,
  ORDER_NAME_COLUMN,
  ORDER_DATE_COLUMN,
  CUSTOMER_NAME_COLUMN,
  CUSTOMER_EMAIL_COLUMN,
  SALES_CHANNEL_COLUMN,
  CURRENCY_COLUMN,
  DISCOUNT_COLUMN,
  ITEMS_COLUMN,
} from "./config.ts";

const sdk = createZapierSdk();

// The paid order as the Shopify New Paid Order trigger delivers it. Fields are optional because
// orders differ in what they carry; the row keeps whatever is present.
const LineItemSchema = z
  .object({
    title: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    quantity: z.union([z.number(), z.string()]).nullable().optional(),
  })
  .loose();

const InputSchema = z
  .object({
    id: z.union([z.string(), z.number()]),
    name: z.string().nullable().optional(),
    createdAt: z.string().nullable().optional(),
    email: z.string().nullable().optional(),
    sourceName: z.string().nullable().optional(),
    currencyCode: z.string().nullable().optional(),
    billingAddress: z
      .object({ name: z.string().nullable().optional() })
      .loose()
      .nullable()
      .optional(),
    lineItems: z.array(LineItemSchema).nullable().optional(),
    totalDiscountsSet: z
      .object({
        shopMoney: z
          .object({ amount: z.string().nullable().optional() })
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
  "log-new-paid-shopify-orders-to-google-sheets",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const loggedAt = await ctx.step("capture-logged-at", async () =>
      new Date().toISOString(),
    );

    const items = (input.lineItems ?? [])
      .map(
        (item) =>
          `${item.quantity ?? 1} x ${item.title ?? item.name ?? "Item"}`,
      )
      .join("; ");

    const row = await ctx.step("log-order-row", async () =>
      sdk.runAction({
        appKey: "google-sheets",
        actionType: "write",
        actionKey: "add_row",
        connection: "google-sheets",
        inputs: {
          spreadsheet: SPREADSHEET_ID,
          worksheet: WORKSHEET_ID,
          [LOGGED_AT_COLUMN]: loggedAt,
          [ORDER_ID_COLUMN]: String(input.id),
          [ORDER_NAME_COLUMN]: input.name ?? "",
          [ORDER_DATE_COLUMN]: input.createdAt ?? "",
          [CUSTOMER_NAME_COLUMN]: input.billingAddress?.name ?? "",
          [CUSTOMER_EMAIL_COLUMN]: input.email ?? "",
          [SALES_CHANNEL_COLUMN]: input.sourceName ?? "",
          [CURRENCY_COLUMN]: input.currencyCode ?? "",
          [DISCOUNT_COLUMN]: input.totalDiscountsSet?.shopMoney?.amount ?? "0",
          [ITEMS_COLUMN]: items,
        },
      }),
    );

    return {
      orderId: String(input.id),
      loggedAt,
      row: row.data?.[0] ?? null,
    };
  },
);

export default workflow;
