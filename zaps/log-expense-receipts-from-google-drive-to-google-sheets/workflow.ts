import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  MODEL_ID,
  LOGGED_AT_COLUMN,
  FILE_ID_COLUMN,
  FILE_NAME_COLUMN,
  FILE_LINK_COLUMN,
  MERCHANT_COLUMN,
  RECEIPT_DATE_COLUMN,
  TOTAL_COLUMN,
  CURRENCY_COLUMN,
  CATEGORY_COLUMN,
} from "./config.ts";

const sdk = createZapierSdk();

// The vision step sees only the image. Its description is what the field extraction reads.
const VISION_INSTRUCTIONS =
  "Describe this receipt in plain text: the merchant, the date, every line item with its amount, the tax, the total and the currency. Write only what is printed on the receipt.";

// Each field is returned as a key of one JSON object; missing values are empty strings.
const EXTRACT_INSTRUCTIONS =
  'Return only JSON with the keys "merchant", "receipt_date", "total", "currency" and "category", taken from the receipt description. "category" is one of: Travel, Meals, Office, Software, Other. Use "" for any value that is missing; never invent one.';

const InputSchema = z
  .object({
    id: z.string(),
    title: z.string().nullable().optional(),
    originalFilename: z.string().nullable().optional(),
    alternateLink: z.string().nullable().optional(),
    file: z.string().nullable().optional(),
  })
  .loose();

interface ReceiptFields {
  merchant?: string;
  receipt_date?: string;
  total?: string;
  currency?: string;
  category?: string;
}

// The model's reply is free text; anything that isn't a JSON object leaves every column empty.
function parseReceiptFields(reply: string): ReceiptFields {
  try {
    const parsed: unknown = JSON.parse(reply);
    return typeof parsed === "object" && parsed !== null
      ? (parsed as ReceiptFields)
      : {};
  } catch {
    return {};
  }
}

const workflow = defineDurable(
  "log-expense-receipts-from-google-drive-to-google-sheets",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const fileName = input.originalFilename ?? input.title ?? "";

    const loggedAt = await ctx.step("capture-logged-at", async () =>
      new Date().toISOString(),
    );

    const description = await ctx.step(
      `analyze-receipt-${input.id}`,
      async () =>
        sdk.runAction({
          appKey: "chatgpt",
          actionType: "write",
          actionKey: "analyze_image_content_with_vision",
          connection: "chatgpt",
          inputs: {
            model: MODEL_ID,
            instructions: VISION_INSTRUCTIONS,
            file: input.file ?? "",
          },
        }),
    );
    const receiptText = JSON.stringify(description.data[0] ?? {});

    const extracted = await ctx.step(
      `extract-receipt-fields-${input.id}`,
      async () =>
        sdk.runAction({
          appKey: "chatgpt",
          actionType: "write",
          actionKey: "conversation_responses_api",
          connection: "chatgpt",
          inputs: {
            model: MODEL_ID,
            instructions: EXTRACT_INSTRUCTIONS,
            user_message: receiptText,
            response_format: "text",
          },
        }),
    );
    const reply = extracted.data[0] as { output?: unknown } | undefined;
    const fields = parseReceiptFields(String(reply?.output ?? ""));

    const row = await ctx.step(`log-receipt-row-${input.id}`, async () =>
      sdk.runAction({
        appKey: "google-sheets",
        actionType: "write",
        actionKey: "add_row",
        connection: "google-sheets",
        inputs: {
          spreadsheet: SPREADSHEET_ID,
          worksheet: WORKSHEET_ID,
          [LOGGED_AT_COLUMN]: loggedAt,
          [FILE_ID_COLUMN]: input.id,
          [FILE_NAME_COLUMN]: fileName,
          [FILE_LINK_COLUMN]: input.alternateLink ?? "",
          [MERCHANT_COLUMN]: fields.merchant ?? "",
          [RECEIPT_DATE_COLUMN]: fields.receipt_date ?? "",
          [TOTAL_COLUMN]: fields.total ?? "",
          [CURRENCY_COLUMN]: fields.currency ?? "",
          [CATEGORY_COLUMN]: fields.category ?? "",
        },
      }),
    );

    return {
      fileId: input.id,
      loggedAt,
      fields,
      row: row.data?.[0] ?? null,
    };
  },
);

export default workflow;
