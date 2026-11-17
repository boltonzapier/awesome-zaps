import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";

import {
  ENGAGEMENT_TABLE_ID,
  LEADERSHIP_CHANNEL_ID,
  EVENT_DATE_FIELD,
  EVENT_TYPE_FIELD,
  MEMBER_NAME_FIELD,
  MESSAGE_TYPE,
  REACTION_TYPE,
  REPORT_TITLE,
  AI_MODEL_ID,
  AI_AUTHENTICATION_ID,
} from "./config.ts";

const sdk = createZapierSdk();

const INSIGHTS_PROMPT =
  "You write the monthly engagement report for an employee resource group's leadership channel. The tally in the tally input field lists, per member, the messages and reactions for the month, followed by the totals.\n\nWrite three to five short bullet points: what the month's activity shows, who led it, and one suggestion for next month. Use only the numbers in the tally, and don't name anyone who isn't listed.\n\nReturn only the bullet points, with no heading, label or intro.";

type Row = { data?: Record<string, unknown> | null };

// Reads one column of a Zapier Tables row as text.
const tableField = (row: Row, key: string): string =>
  String(row.data?.[key] ?? "").trim();

const workflow = defineDurable(
  "post-monthly-erg-slack-engagement-insights-from-zapier-tables",
  async (ctx) => {
    // Reports cover the calendar month before the run, in UTC.
    const period = await ctx.step("capture-report-period", async () => {
      const now = new Date();
      const start = new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - 1, 1),
      );
      return {
        month: start.toISOString().slice(0, 7),
        label: start.toLocaleString("en-US", {
          month: "long",
          year: "numeric",
          timeZone: "UTC",
        }),
      };
    });

    const found = await ctx.step("find-engagement-rows", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "search",
        actionKey: "find_records",
        connection: "zapier-tables",
        inputs: {
          table_id: ENGAGEMENT_TABLE_ID,
          filter_count: "1",
          field_data_key: EVENT_DATE_FIELD,
          operator: "different",
          lookup_value: "lookup all options",
        },
      }),
    );

    const rows = (found.data as Row[]).filter((row) =>
      tableField(row, EVENT_DATE_FIELD).startsWith(period.month),
    );
    if (rows.length === 0) {
      return {
        skipped: true,
        reason: "no-engagement-rows",
        month: period.month,
      };
    }

    // Counts are worked out here so the AI only writes about numbers it was given.
    const byMember = new Map<string, { messages: number; reactions: number }>();
    for (const row of rows) {
      const member = tableField(row, MEMBER_NAME_FIELD) || "Unknown member";
      const counts = byMember.get(member) ?? { messages: 0, reactions: 0 };
      const type = tableField(row, EVENT_TYPE_FIELD);
      if (type === MESSAGE_TYPE) counts.messages += 1;
      if (type === REACTION_TYPE) counts.reactions += 1;
      byMember.set(member, counts);
    }

    const ranked = [...byMember.entries()].sort(
      ([, a], [, b]) => b.messages + b.reactions - (a.messages + a.reactions),
    );
    const totals = ranked.reduce(
      (sum, [, c]) => ({
        messages: sum.messages + c.messages,
        reactions: sum.reactions + c.reactions,
      }),
      { messages: 0, reactions: 0 },
    );
    const tally = ranked.map(
      ([member, c]) =>
        `- ${member}: ${c.messages} messages, ${c.reactions} reactions`,
    );
    const tallyText = [
      `Totals: ${totals.messages} messages, ${totals.reactions} reactions`,
      ...tally,
    ].join("\n");

    const drafted = await ctx.step("write-monthly-insights", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        connection: "ai",
        inputs: {
          model_id: AI_MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: INSIGHTS_PROMPT,
          inputFields: { report_month: period.label, tally: tallyText },
          includeWorkflowData: false,
          outputFields: [{ name: "insights", type: "text", isRequired: true }],
          isOutputArray: false,
        },
      }),
    );
    const insights =
      (drafted.data[0] as { insights?: string | null } | undefined)?.insights ??
      "";

    const post = await ctx.step("post-report-to-leadership", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: LEADERSHIP_CHANNEL_ID,
          text: `*${REPORT_TITLE}: ${period.label}*\n\n${insights}\n\n${tallyText}`,
        },
      }),
    );

    return {
      month: period.month,
      messages: totals.messages,
      reactions: totals.reactions,
      post: post.data[0] ?? null,
    };
  },
);

export default workflow;
