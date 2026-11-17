// This zap's settings. Each "REPLACE_…" value is set per person before building; its comment says how to get it.
// The other values are defaults you can change.

// Ask the user which Asana workspace the tasks go in, then pick it from the workspace list on their Asana connection.
export const ASANA_WORKSPACE_ID = "REPLACE_ASANA_WORKSPACE_ID";
// Ask the user which Asana project the tasks go in (it must belong to the workspace above), then pick it from the project list on their Asana connection.
export const ASANA_PROJECT_ID = "REPLACE_ASANA_PROJECT_ID";
// Ask the user who the tasks are assigned to, then pick that person from the assignee list on their Asana connection.
export const ASANA_ASSIGNEE_ID = "REPLACE_ASANA_ASSIGNEE_ID";
// Ask the user where the Slack notification goes (a channel, or their own Slack username such as @name), then look it up with their Slack connection.
export const SLACK_CHANNEL = "REPLACE_SLACK_CHANNEL";

// Model the AI by Zapier step uses to extract tasks.
export const AI_MODEL = "openai/gpt-4o-mini";
// Senders whose address contains this text are skipped, since they cannot receive replies.
export const NO_REPLY_MARKER = "noreply";
