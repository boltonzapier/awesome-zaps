// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const QUOTE_TABLE_ID = "REPLACE_QUOTE_TABLE_ID"; // Ask the user which Zapier Table tracks quote approvals, then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.
export const APPROVAL_CHANNEL_ID = "REPLACE_APPROVAL_CHANNEL_ID"; // Ask the user which Slack channel quote approvals are posted in, then look up its ID (C…) with their Slack connection.
export const APPROVER_MENTIONS = "REPLACE_APPROVER_MENTIONS"; // Ask the user who must approve quotes, then copy their mention from Slack: a person as <@U…>, or a user group as <!subteam^S…>. Several can be separated by spaces.
export const HUBSPOT_PORTAL_ID = "REPLACE_HUBSPOT_PORTAL_ID"; // Ask the user for their HubSpot account ID: the number in any HubSpot record URL, such as app.hubspot.com/contacts/<number>/.

// Table field keys (f1 = first column). Map each to the matching column in the user's quote table.
export const QUOTE_ID_FIELD = "f1";
export const OWNER_ID_FIELD = "f2";
export const DEAL_ID_FIELD = "f3";
export const QUOTE_LINK_FIELD = "f4";
export const CONCESSIONS_FIELD = "f5";

// Name shown above each approval request in Slack.
export const APPROVAL_BOT_NAME = "Quote Approval Bot";
