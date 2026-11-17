// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TASK_TABLE_ID = "REPLACE_TASK_TABLE_ID"; // Ask the user which Zapier Table is their to-do list, then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.

// Table field key for the task text (f1 = first column, the template's "Message" field).
export const MESSAGE_FIELD = "f1";
// Table field key for the channel dropdown (f3 = third column, the template's "Channel" field).
export const CHANNEL_FIELD = "f3";
// Channel choice written to each task, matching the dropdown's "Gmail" option.
export const GMAIL_CHANNEL = "Gmail";
