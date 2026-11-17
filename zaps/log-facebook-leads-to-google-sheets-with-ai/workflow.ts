import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  MODEL_ID,
  COLUMN_LEAD_ID,
  COLUMN_CREATED_AT,
  COLUMN_FULL_NAME,
  COLUMN_EMAIL,
  COLUMN_PHONE,
  COLUMN_FIRST_NAME,
  COLUMN_LAST_NAME,
  COLUMN_NAME_TYPE,
  COLUMN_NAME_NOTE,
} from "./config.ts";

const sdk = createZapierSdk();

// The AI step reads only the name. Each output field below becomes one value in the sheet row.
const NAME_INSTRUCTIONS =
  "You receive one Facebook lead's full name as inputFields.full_name. Split it into first_name and last_name. Set name_type to person when it reads as a personal name, business when it reads as a company or brand, and unclear otherwise. Put one sentence explaining the call in name_note. Leave a field empty when it cannot be determined; never invent a name.";

const NAME_OUTPUT_FIELDS = [
  { name: "first_name", description: "The given name, or empty." },
  { name: "last_name", description: "The family name, or empty." },
  { name: "name_type", description: "person, business or unclear." },
  { name: "name_note", description: "One sentence explaining name_type." },
];

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
  "log-facebook-leads-to-google-sheets-with-ai",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const fullName = (input.FULL_NAME ?? "").trim();

    const analysis = await ctx.step(`analyze-name-${input.id}`, async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: MODEL_ID,
          authentication_id: "0",
          includeWorkflowData: "false",
          instructions: NAME_INSTRUCTIONS,
          inputFields: { full_name: fullName },
          outputFields: NAME_OUTPUT_FIELDS,
        },
      }),
    );

    const fields = (analysis.data?.[0] ?? {}) as {
      first_name?: string;
      last_name?: string;
      name_type?: string;
      name_note?: string;
    };

    const row = await ctx.step(`add-lead-row-${input.id}`, async () =>
      sdk.runAction({
        appKey: "google-sheets",
        actionType: "write",
        actionKey: "add_row",
        connection: "google-sheets",
        inputs: {
          spreadsheet: SPREADSHEET_ID,
          worksheet: WORKSHEET_ID,
          [COLUMN_LEAD_ID]: input.id,
          [COLUMN_CREATED_AT]: input.created_time ?? "",
          [COLUMN_FULL_NAME]: fullName,
          [COLUMN_EMAIL]: input.EMAIL ?? "",
          [COLUMN_PHONE]: input.PHONE_NUMBER ?? "",
          [COLUMN_FIRST_NAME]: fields.first_name ?? "",
          [COLUMN_LAST_NAME]: fields.last_name ?? "",
          [COLUMN_NAME_TYPE]: fields.name_type ?? "",
          [COLUMN_NAME_NOTE]: fields.name_note ?? "",
        },
      }),
    );

    return {
      leadId: input.id,
      analysis: fields,
      row: row.data?.[0] ?? null,
    };
  },
);

export default workflow;
