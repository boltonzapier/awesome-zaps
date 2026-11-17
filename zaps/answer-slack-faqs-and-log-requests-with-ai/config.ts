// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SLACK_CHANNEL_ID = "REPLACE_SLACK_CHANNEL_ID"; // Ask the user which channel employees post questions in, then look up its ID (C…) with their Slack connection. The trigger watches it and the replies go there.
export const FAQ_TABLE_ID = "REPLACE_FAQ_TABLE_ID"; // Ask the user which Zapier Table holds the FAQ answers, then take its ID from the table's URL.
export const HELP_TABLE_ID = "REPLACE_HELP_TABLE_ID"; // Ask the user which Zapier Table collects requests the FAQ can't answer, then take its ID from the table's URL.

// FAQ table field IDs: the question and the answer. The template's FAQ table uses f1 and f2.
export const FAQ_QUESTION_FIELD = "f1";
export const FAQ_ANSWER_FIELD = "f2";

// Help requests table field IDs. The template's Help requests table uses these.
export const HELP_REQUEST_FIELD = "f1"; // The question as asked.
export const HELP_REQUESTER_FIELD = "f2"; // The requester's email.
export const HELP_ESCALATE_FIELD = "f3"; // Checkbox: set to true so the team sees it needs a person.
export const HELP_LINK_FIELD = "f6"; // Link to the original Slack message.
export const HELP_THREAD_FIELD = "f7"; // Slack thread timestamp, so later steps can find the row.

// AI by Zapier model tier. Prompt-only, so no tool-capable model is needed.
export const MODEL_ID = "standard/auto";
// Longest FAQ text sent to the AI, in characters, to keep the prompt small.
export const MAX_FAQ_CHARS = 30000;
