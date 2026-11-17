// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Tables table holds the project plan, then look up its ID with their Zapier Tables connection (the table ID in the table's URL). The button trigger watches this table.
export const SLACK_CHANNEL_ID = "REPLACE_SLACK_CHANNEL_ID"; // Ask the user which channel receives the project updates, then look up its ID (C…) with their Slack connection.

// Field keys for the columns in the project plan table. Look each one up with the user's Zapier Tables connection.
export const NAME_FIELD = "REPLACE_NAME_FIELD"; // Ask the user which column holds the project name, then look up its field key.
export const OWNER_FIELD = "REPLACE_OWNER_FIELD"; // Ask the user which column holds the project owner, then look up its field key.
export const STATUS_FIELD = "REPLACE_STATUS_FIELD"; // Ask the user which column holds the status, then look up its field key.
export const CATEGORY_FIELD = "REPLACE_CATEGORY_FIELD"; // Ask the user which column holds the category, then look up its field key.
export const START_DATE_FIELD = "REPLACE_START_DATE_FIELD"; // Ask the user which column holds the start date, then look up its field key.
export const END_DATE_FIELD = "REPLACE_END_DATE_FIELD"; // Ask the user which column holds the end date, then look up its field key.
export const NOTES_FIELD = "REPLACE_NOTES_FIELD"; // Ask the user which column holds the notes, then look up its field key.
export const LAST_UPDATE_SENT_FIELD = "REPLACE_LAST_UPDATE_SENT_FIELD"; // Ask the user which date-and-time column records when an update was sent, then look up its field key.

// Name the Slack message appears under.
export const SLACK_USERNAME = "Project Update";
