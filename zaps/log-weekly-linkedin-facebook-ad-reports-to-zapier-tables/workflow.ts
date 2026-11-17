import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  LINKEDIN_AD_ACCOUNT_ID,
  TABLE_ID,
  FIELD_CAMPAIGN_NAME,
  FIELD_PLATFORM,
  FIELD_AD_NAME,
  FIELD_IMPRESSIONS,
  FIELD_CLICKS,
  FIELD_CTR,
  FIELD_LEADS,
  FIELD_COST_PER_LEAD,
  FIELD_AD_SPEND,
  FIELD_DATE,
  REPORT_START,
  REPORT_END,
} from "./config.ts";

const sdk = createZapierSdk();

// Metrics LinkedIn returns for each campaign in the report window.
const LINKEDIN_METRICS = [
  "dateRange",
  "costInUsd",
  "clicks",
  "actionClicks",
  "impressions",
];

// The schedule trigger delivers no fields the zap uses; the parse only guards the shape.
const InputSchema = z.object({}).loose();

type Row = Record<string, unknown>;

const text = (value: unknown) =>
  value === null || value === undefined ? "" : String(value);
const num = (value: unknown) => Number(value ?? 0) || 0;
const ratio = (part: number, whole: number) =>
  whole > 0 ? ((part / whole) * 100).toFixed(2) : "0";
const perUnit = (spend: number, units: number) =>
  units > 0 ? (spend / units).toFixed(2) : "0";

// One Tables row for one ad or campaign. Columns the source does not report stay blank.
const tableRow = (
  platform: string,
  reportedAt: string,
  values: {
    campaign: string;
    ad: string;
    impressions: number;
    clicks: number;
    spend: number;
    leads: number;
  },
) => ({
  [`new__data__${FIELD_CAMPAIGN_NAME}`]: values.campaign,
  [`new__data__${FIELD_PLATFORM}`]: platform,
  [`new__data__${FIELD_AD_NAME}`]: values.ad,
  [`new__data__${FIELD_IMPRESSIONS}`]: String(values.impressions),
  [`new__data__${FIELD_CLICKS}`]: String(values.clicks),
  [`new__data__${FIELD_CTR}`]: ratio(values.clicks, values.impressions),
  [`new__data__${FIELD_LEADS}`]: String(values.leads),
  [`new__data__${FIELD_COST_PER_LEAD}`]: perUnit(values.spend, values.leads),
  [`new__data__${FIELD_AD_SPEND}`]: String(values.spend),
  [`new__data__${FIELD_DATE}`]: reportedAt,
});

const workflow = defineDurable(
  "log-weekly-linkedin-facebook-ad-reports-to-zapier-tables",
  async (ctx, rawInput) => {
    InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const reportedAt = await ctx.step("capture-report-date", async () =>
      new Date().toISOString(),
    );

    const linkedin = await ctx.step("pull-linkedin-campaign-report", async () =>
      sdk.runAction({
        appKey: "linkedin-ads",
        actionType: "write",
        actionKey: "report",
        connection: "linkedin-ads",
        inputs: {
          account: LINKEDIN_AD_ACCOUNT_ID,
          pivots: ["CAMPAIGN"],
          metrics: LINKEDIN_METRICS,
          startDateTime: REPORT_START,
          endDateTime: REPORT_END,
        },
      }),
    );

    const facebook = await ctx.step("pull-facebook-ad-statistics", async () =>
      sdk.runAction({
        appKey: "facebook-lead-ads",
        actionType: "write",
        actionKey: "report_adstatistics",
        connection: "facebook-lead-ads",
        inputs: {},
      }),
    );

    const linkedinRows = linkedin.data as Row[];
    const facebookRows = facebook.data as Row[];

    // Step names end with the campaign or ad id plus the report date, so each row is journaled on its own.
    const reportDay = reportedAt.slice(0, 10);

    const linkedinWritten: unknown[] = [];
    for (const row of linkedinRows) {
      const campaign = text(row.campaignName ?? row.pivotValues);
      const campaignId = text(row.pivotValues ?? row.campaign ?? campaign);
      const record = await ctx.step(
        `write-linkedin-table-row-${campaignId}-${reportDay}`,
        async () =>
          sdk.runAction({
            appKey: "zapier-tables",
            actionType: "write",
            actionKey: "create_record",
            connection: "zapier-tables",
            inputs: {
              table_id: TABLE_ID,
              ...tableRow("LinkedIn Ads", reportedAt, {
                campaign,
                ad: "",
                impressions: num(row.impressions),
                clicks: num(row.clicks),
                spend: num(row.costInUsd),
                leads: num(row.actionClicks),
              }),
            },
          }),
      );
      linkedinWritten.push(record.data[0] ?? null);
    }

    const facebookWritten: unknown[] = [];
    for (const row of facebookRows) {
      const adId = text(
        row.ad_id ?? `${text(row.campaign_name)}-${text(row.ad_name)}`,
      );
      const record = await ctx.step(
        `write-facebook-table-row-${adId}-${reportDay}`,
        async () =>
          sdk.runAction({
            appKey: "zapier-tables",
            actionType: "write",
            actionKey: "create_record",
            connection: "zapier-tables",
            inputs: {
              table_id: TABLE_ID,
              ...tableRow("Facebook Ads", reportedAt, {
                campaign: text(row.campaign_name),
                ad: text(row.ad_name),
                impressions: num(row.impressions),
                clicks: num(row.clicks),
                spend: num(row.spend),
                leads: num(row.leads),
              }),
            },
          }),
      );
      facebookWritten.push(record.data[0] ?? null);
    }

    return {
      reportedAt,
      linkedinRows: linkedinWritten.length,
      facebookRows: facebookWritten.length,
    };
  },
);

export default workflow;
