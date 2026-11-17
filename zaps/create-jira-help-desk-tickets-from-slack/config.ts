// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SLACK_CHANNEL_ID = "REPLACE_SLACK_CHANNEL_ID"; // Ask the user which channel IT requests are posted in, then look up its ID (C…) with their Slack connection. The trigger watches it and the ticket reply goes there.
export const JIRA_PROJECT_ID = "REPLACE_JIRA_PROJECT_ID"; // Ask the user which Jira project holds IT tickets, then look up its ID with their Jira Software Cloud connection.
export const JIRA_ISSUE_TYPE_ID = "REPLACE_JIRA_ISSUE_TYPE_ID"; // Ask the user which issue type the IT tickets use (for example Task), then look up its ID with the same connection.

// Label added to every ticket, so IT requests can be filtered in Jira.
export const JIRA_LABEL = "it-helpdesk";
// Longest summary taken from the message's first line; Jira rejects summaries past 255 characters.
export const SUMMARY_LENGTH = 200;
