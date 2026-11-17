// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SLACK_CHANNEL_ID = "REPLACE_SLACK_CHANNEL_ID"; // Ask the user which channel employees post HR questions in, then look up its ID (the C… ID) with their Slack connection. The same value as the channel in triggers/.
export const FAQ_TABLE_ID = "REPLACE_FAQ_TABLE_ID"; // Ask the user which Zapier Table holds the HR FAQs, then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.
export const REQUEST_TABLE_ID = "REPLACE_REQUEST_TABLE_ID"; // Ask the user which Zapier Table logs HR requests, then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.

// Model the AI step answers with. "standard/auto" lets Zapier pick an account-usable model in that tier.
export const MODEL_ID = "standard/auto";

// FAQ table column keys (f1 = first column).
export const FAQ_QUESTION_FIELD = "f1";
export const FAQ_ANSWER_FIELD = "f2";

// Request table column keys (f1 = first column).
export const REQUEST_TEXT_FIELD = "f1";
export const REQUESTER_EMAIL_FIELD = "f2";
export const ESCALATE_FIELD = "f3";
export const AI_ANSWER_FIELD = "f4";
export const MESSAGE_URL_FIELD = "f6";
export const MESSAGE_TS_FIELD = "f7";
export const REPORTER_ID_FIELD = "f8";
export const CREATED_FIELD = "f12";
export const DEFLECTED_FIELD = "f15";
