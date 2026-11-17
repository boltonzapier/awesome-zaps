import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  SLACK_CHANNEL_ID,
  SLACK_USERNAME,
  NAME_FIELD,
  OWNER_FIELD,
  STATUS_FIELD,
  CATEGORY_FIELD,
  START_DATE_FIELD,
  END_DATE_FIELD,
  NOTES_FIELD,
  LAST_UPDATE_SENT_FIELD,
} from "./config.ts";

const sdk = createZapierSdk();

// The record whose button was clicked, as the Zapier Tables button trigger delivers it. Its field
// values are read by the keys set in config.ts, so each one may be empty.
const InputSchema = z
  .object({
    record_id: z.union([z.string(), z.number()]),
  })
  .loose();

const workflow = defineDurable(
  "send-project-plan-updates-to-slack-from-zapier-tables",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const recordId = String(input.record_id);
    const field = (key: string) => String(input[key] ?? "");

    const message = [
      `*Project Update for: ${field(NAME_FIELD)}*`,
      `Owner: ${field(OWNER_FIELD)}`,
      `Status: ${field(STATUS_FIELD)}`,
      `Category: ${field(CATEGORY_FIELD)}`,
      `Notes: ${field(NOTES_FIELD)}`,
      `Start Date: ${field(START_DATE_FIELD)}`,
      `End Date: ${field(END_DATE_FIELD)}`,
      "",
      `<https://tables.zapier.com/app/tables/t/${TABLE_ID}?recordId=${recordId}|View in Tables>`,
    ].join("\n");

    const post = await ctx.step("post-project-update-to-slack", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: SLACK_CHANNEL_ID,
          text: message,
          username: SLACK_USERNAME,
          as_bot: "yes",
          unfurl: "yes",
          link_names: "yes",
          add_edit_link: "yes",
          reply_broadcast: "no",
        },
      }),
    );

    const sentAt = await ctx.step("capture-sent-at", async () =>
      new Date().toISOString(),
    );

    const update = await ctx.step("write-last-update-sent", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "update_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          record_id: recordId,
          [LAST_UPDATE_SENT_FIELD]: sentAt,
        },
      }),
    );

    return {
      recordId,
      sentAt,
      posted: post.data?.[0] ?? null,
      updated: update.data?.[0] ?? null,
    };
  },
);

export default workflow;
