import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  DATA_SOURCE,
  TITLE_PROPERTY,
  DATE_PROPERTY,
  SPACE_PROPERTY,
  STATUS_PROPERTY,
  STATUS_VALUE,
} from "./config.ts";

const sdk = createZapierSdk();

// The new calendar event as the Google Calendar trigger delivers it. Every field except the id is
// optional because events differ in what they carry.
const TimeSchema = z
  .object({
    dateTime: z.string().nullable().optional(),
    date: z.string().nullable().optional(),
  })
  .loose()
  .nullable()
  .optional();

const InputSchema = z
  .object({
    id: z.string(),
    summary: z.string().nullable().optional(),
    location: z.string().nullable().optional(),
    start: TimeSchema,
  })
  .loose();

const workflow = defineDurable(
  "create-notion-database-entries-from-google-calendar-events",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    // All-day events carry only a date, and the Notion date property accepts either form.
    const when = input.start?.dateTime ?? input.start?.date ?? null;

    const entry = await ctx.step(`create-notion-entry-${input.id}`, async () =>
      sdk.runAction({
        appKey: "notion",
        actionType: "write",
        actionKey: "create_database_item",
        connection: "notion",
        inputs: {
          datasource: DATA_SOURCE,
          template_mode: "none",
          [TITLE_PROPERTY]: input.summary ?? "(no title)",
          ...(when ? { [DATE_PROPERTY]: when } : {}),
          [SPACE_PROPERTY]: input.location ?? "",
          [STATUS_PROPERTY]: STATUS_VALUE,
        },
      }),
    );

    return { eventId: input.id, created: entry.data?.[0] ?? null };
  },
);

export default workflow;
