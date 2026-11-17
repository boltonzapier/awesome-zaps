// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const LINKEDIN_AD_ACCOUNT_ID = "REPLACE_LINKEDIN_AD_ACCOUNT_ID"; // Ask the user which LinkedIn ad account to report on, then look up its numeric ID with their LinkedIn Ads connection.
export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Tables table holds the ad report, then look up its ID with their Zapier Tables connection. Its columns must match the field keys below.

// Report window: from seven days ago until now.
export const REPORT_START = "today-7d";
export const REPORT_END = "now";

// Field keys of the ad report table (f<number>), one per column. Check them against the table's fields with the user's Zapier Tables connection before the first run.
export const FIELD_CAMPAIGN_NAME = "f1";
export const FIELD_PLATFORM = "f2";
export const FIELD_AD_NAME = "f3";
export const FIELD_IMPRESSIONS = "f4";
export const FIELD_CLICKS = "f5";
export const FIELD_CTR = "f6";
export const FIELD_LEADS = "f7";
export const FIELD_COST_PER_LEAD = "f8";
export const FIELD_AD_SPEND = "f9";
export const FIELD_DATE = "f13";
