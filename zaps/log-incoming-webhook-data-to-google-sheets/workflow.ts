import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  RECEIVED_AT_COLUMN,
  PAYLOAD_COLUMN,
} from "./config.ts";

const sdk = createZapierSdk();

// The webhook's request body as the Catch Hook trigger delivers it. Its shape is whatever the sender
// posts, so the schema only requires an object and the whole payload is kept as text in the row.
const InputSchema = z.object({}).loose();

const workflow = defineDurable(
  "log-incoming-webhook-data-to-google-sheets",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const receivedAt = await ctx.step("capture-received-at", async () =>
      new Date().toISOString(),
    );

    const row = await ctx.step("log-webhook-row", async () =>
      sdk.runAction({
        appKey: "google-sheets",
        actionType: "write",
        actionKey: "add_row",
        connection: "google-sheets",
        inputs: {
          spreadsheet: SPREADSHEET_ID,
          worksheet: WORKSHEET_ID,
          [RECEIVED_AT_COLUMN]: receivedAt,
          [PAYLOAD_COLUMN]: JSON.stringify(input),
        },
      }),
    );

    return {
      receivedAt,
      row: row.data?.[0] ?? null,
    };
  },
);

export default workflow;
