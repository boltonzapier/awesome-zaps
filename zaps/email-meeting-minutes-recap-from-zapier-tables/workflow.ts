import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  RECAP_EMAIL,
  EMAIL_SUBJECT,
  EMAIL_FROM_NAME,
  DATE_FIELD,
  MEETING_TITLE_FIELD,
  ATTENDEES_FIELD,
  KEY_POINTS_FIELD,
  DECISIONS_FIELD,
  ACTION_ITEMS_FIELD,
  OWNER_FIELD,
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
  "email-meeting-minutes-recap-from-zapier-tables",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const row = input.new.data;

    const text = (key: string) => {
      const value = row[key];
      return value === null || value === undefined ? "" : String(value);
    };

    const body = [
      `Date: ${text(DATE_FIELD)}`,
      `Meeting Title: ${text(MEETING_TITLE_FIELD)}`,
      `Attendees: ${text(ATTENDEES_FIELD)}`,
      `Key Points: ${text(KEY_POINTS_FIELD)}`,
      `Decisions Made: ${text(DECISIONS_FIELD)}`,
      `Action Items: ${text(ACTION_ITEMS_FIELD)}`,
      `Owner: ${text(OWNER_FIELD)}`,
    ].join("\n");

    const sent = await ctx.step("send-recap-email", async () =>
      sdk.runAction({
        appKey: "email",
        actionType: "write",
        actionKey: "outbound",
        connection: "email",
        inputs: {
          to: RECAP_EMAIL,
          subject: EMAIL_SUBJECT,
          from_name: EMAIL_FROM_NAME,
          body,
        },
      }),
    );

    return {
      recordId: input.record_id,
      email: sent.data?.[0] ?? null,
    };
  },
);

export default workflow;
