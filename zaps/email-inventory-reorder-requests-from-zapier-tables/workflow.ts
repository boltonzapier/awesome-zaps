import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  REORDER_EMAIL,
  ITEM_FIELD,
  DESCRIPTION_FIELD,
  VENDOR_FIELD,
  REORDER_QUANTITY_FIELD,
  NEED_MORE_FIELD,
  LAST_REORDER_NOTE_FIELD,
  EMAIL_SUBJECT,
  EMAIL_FROM_NAME,
} from "./config.ts";

const sdk = createZapierSdk();

// The button's record arrives with the table and record IDs, and its fields prefixed "new__".
const InputSchema = z
  .object({
    table_id: z.string(),
    record_id: z.string(),
  })
  .loose();

const workflow = defineDurable(
  "email-inventory-reorder-requests-from-zapier-tables",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const field = (key: string) => {
      const value = input[`new__${key}`];
      return value === null || value === undefined ? "" : String(value);
    };

    // The email is sent before the record is reset, so it reports the quantity that was requested.
    const requested = field(REORDER_QUANTITY_FIELD);
    const body = [
      `Item: ${field(ITEM_FIELD)}`,
      `Description: ${field(DESCRIPTION_FIELD)}`,
      `Vendor: ${field(VENDOR_FIELD)}`,
      `Quantity requested: ${requested}`,
    ].join("\n");

    const sent = await ctx.step("send-reorder-email", async () =>
      sdk.runAction({
        appKey: "email",
        actionType: "write",
        actionKey: "outbound",
        connection: "email",
        inputs: {
          to: REORDER_EMAIL,
          subject: EMAIL_SUBJECT,
          from_name: EMAIL_FROM_NAME,
          body,
          open_tracking: "False",
          force_linebreaks: "False",
        },
      }),
    );

    // One write logs the request and clears the checkbox and quantity; the template's second
    // write blanked the note it had just set, so the note is written once here.
    const updated = await ctx.step("log-reorder-on-record", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "update_record",
        connection: "zapier-tables",
        inputs: {
          table_id: input.table_id,
          record_id: input.record_id,
          [`new__${NEED_MORE_FIELD}`]: false,
          [`new__${REORDER_QUANTITY_FIELD}`]: "0",
          [`new__${LAST_REORDER_NOTE_FIELD}`]: `requested ${requested} more`,
        },
      }),
    );

    return {
      recordId: input.record_id,
      requested,
      email: sent.data?.[0] ?? null,
      record: updated.data?.[0] ?? null,
    };
  },
);

export default workflow;
