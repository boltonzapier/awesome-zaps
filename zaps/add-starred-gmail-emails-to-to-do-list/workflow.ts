import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TASK_TABLE_ID,
  MESSAGE_FIELD,
  CHANNEL_FIELD,
  GMAIL_CHANNEL,
} from "./config.ts";

const sdk = createZapierSdk();

// The starred email, as the trigger delivers it.
const InputSchema = z
  .object({
    subject: z.string().nullable().optional(),
    body_plain: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "add-starred-gmail-emails-to-to-do-list",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const task = `${input.subject ?? ""}\n${input.body_plain ?? ""}`;

    const record = await ctx.step("create-task-record", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TASK_TABLE_ID,
          [`new__data__${MESSAGE_FIELD}`]: task,
          [`new__data__${CHANNEL_FIELD}`]: GMAIL_CHANNEL,
        },
      }),
    );

    return { task, created: record.data[0] ?? null };
  },
);

export default workflow;
