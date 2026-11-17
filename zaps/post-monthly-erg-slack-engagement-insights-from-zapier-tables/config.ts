// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const ENGAGEMENT_TABLE_ID = "REPLACE_ENGAGEMENT_TABLE_ID"; // Ask the user which Zapier Table holds the ERG engagement log (one row per Slack message or reaction), then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.
export const LEADERSHIP_CHANNEL_ID = "REPLACE_LEADERSHIP_CHANNEL_ID"; // Ask the user which Slack channel gets the monthly report, then look up its ID (C…) with their Slack connection.

// Engagement table column keys (f1 = first column).
// Date the message or reaction happened, as YYYY-MM-DD.
export const EVENT_DATE_FIELD = "f1";
// Whether the row is a message or a reaction; see the two values below.
export const EVENT_TYPE_FIELD = "f2";
// Name of the team member who posted or reacted.
export const MEMBER_NAME_FIELD = "f3";

// Values written to EVENT_TYPE_FIELD.
export const MESSAGE_TYPE = "message";
export const REACTION_TYPE = "reaction";

// Heading of the Slack report.
export const REPORT_TITLE = "ERG Slack engagement";

// AI model tier; "premium/auto" lets AI by Zapier pick an available model.
export const AI_MODEL_ID = "premium/auto";
// "0" uses Zapier-managed AI credentials.
export const AI_AUTHENTICATION_ID = "0";
