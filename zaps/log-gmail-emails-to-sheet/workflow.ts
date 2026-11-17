import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  LOGGED_AT_COLUMN,
  MESSAGE_ID_COLUMN,
  SENDER_NAME_COLUMN,
  SENDER_EMAIL_COLUMN,
  SUBJECT_COLUMN,
  SNIPPET_COLUMN,
} from "./config.ts";

const sdk = createZapierSdk();

// The matching email as the Gmail search trigger delivers it. Every field is optional because
// emails differ in what they carry; the row keeps whatever is present.
const InputSchema = z
  .object({
    message_id: z.string().nullable().optional(),
    subject: z.string().nullable().optional(),
    snippet: z.string().nullable().optional(),
    from: z
      .object({
        name: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
      })
      .loose()
      .nullable()
      .optional(),
    from__email: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "log-gmail-emails-to-sheet",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const loggedAt = await ctx.step("capture-logged-at", async () =>
      new Date().toISOString(),
    );

    const row = await ctx.step("log-email-row", async () =>
      sdk.runAction({
        appKey: "google-sheets",
        actionType: "write",
        actionKey: "add_row",
        connection: "google-sheets",
        inputs: {
          spreadsheet: SPREADSHEET_ID,
          worksheet: WORKSHEET_ID,
          [LOGGED_AT_COLUMN]: loggedAt,
          [MESSAGE_ID_COLUMN]: input.message_id ?? "",
          [SENDER_NAME_COLUMN]: input.from?.name ?? "",
          [SENDER_EMAIL_COLUMN]: input.from?.email ?? input.from__email ?? "",
          [SUBJECT_COLUMN]: input.subject ?? "",
          [SNIPPET_COLUMN]: input.snippet ?? "",
        },
      }),
    );

    return {
      messageId: input.message_id ?? null,
      loggedAt,
      row: row.data?.[0] ?? null,
    };
  },
);

export default workflow;
