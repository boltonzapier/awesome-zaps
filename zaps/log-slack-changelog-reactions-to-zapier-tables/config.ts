// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TEAM_DIRECTORY_TABLE_ID = "REPLACE_TEAM_DIRECTORY_TABLE_ID"; // Ask the user which Zapier Table lists their team's Slack user IDs, then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.
export const CHANGELOG_TABLE_ID = "REPLACE_CHANGELOG_TABLE_ID"; // Ask the user which Zapier Table holds the changelog entries, then look up its ID with their Zapier Tables connection.
export const CHANGELOG_URL = "REPLACE_CHANGELOG_URL"; // Ask the user for the link to the changelog table or its interface. It is added to the Slack replies.

// Team directory column keys (f1 = first column).
export const TEAM_NAME_FIELD = "f1";
// Column holding each team member's Slack user ID; the reaction's user ID is matched against it.
export const TEAM_SLACK_ID_FIELD = "f2";

// Changelog column keys, in table order: title, summary, Slack message timestamp, Slack message text, Slack link, recorded by, message from.
export const CHANGELOG_TITLE_FIELD = "f1";
export const CHANGELOG_SUMMARY_FIELD = "f2";
// The Slack message timestamp is the duplicate check: a message already in this column is not logged again.
export const CHANGELOG_MESSAGE_TS_FIELD = "f3";
export const CHANGELOG_MESSAGE_TEXT_FIELD = "f4";
export const CHANGELOG_SLACK_LINK_FIELD = "f5";
export const CHANGELOG_RECORDED_BY_FIELD = "f6";
export const CHANGELOG_MESSAGE_FROM_FIELD = "f7";

// AI model tier; "premium/auto" lets AI by Zapier pick an available model.
export const AI_MODEL_ID = "premium/auto";
// "0" uses Zapier-managed AI credentials.
export const AI_AUTHENTICATION_ID = "0";
