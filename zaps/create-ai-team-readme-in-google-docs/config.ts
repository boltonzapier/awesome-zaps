// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Tables table holds the survey answers, then look up its ID with their Zapier Tables connection. The trigger watches it and the update writes back to it, so use the same value in triggers/new-record.ts.
export const DRIVE_FOLDER_ID = "REPLACE_DRIVE_FOLDER_ID"; // Ask the user which Google Drive folder the ReadMes should be created in, then look up its ID (the long ID in the folder's URL) with their Google Drive connection.
export const ORG_DOMAIN = "REPLACE_ORG_DOMAIN"; // Ask the user for their organization's email domain, for example the part after the @ in their work address.

// Title of the ReadMe template document in the user's Google Drive. The zap finds the template by this title.
export const TEMPLATE_TITLE = "[template] Readme";
// Model used by the AI steps.
export const AI_MODEL = "openai/gpt-4o-mini";
// Business days between the employee's draft and the manager's message about it.
export const MANAGER_DM_DELAY_BUSINESS_DAYS = 3;

// Each survey question's column in the table. Ask the user which column holds each answer, then look up its key
// with their Zapier Tables connection.
export const EMAIL_COLUMN = "REPLACE_EMAIL_COLUMN"; // The column with the employee's work email address.
export const LOCATION_COLUMN = "REPLACE_LOCATION_COLUMN"; // The "My typical location is..." answer.
export const TIME_ZONE_COLUMN = "REPLACE_TIME_ZONE_COLUMN"; // The "My typical time zone is..." answer.
export const WORKING_HOURS_COLUMN = "REPLACE_WORKING_HOURS_COLUMN"; // The typical working hours answer.
export const THOUGHT_COLUMN = "REPLACE_THOUGHT_COLUMN"; // The "Thought" answer.
export const SCHEDULE_COLUMN = "REPLACE_SCHEDULE_COLUMN"; // The preferred schedule answer.
export const REPLY_TIMES_COLUMN = "REPLACE_REPLY_TIMES_COLUMN"; // The answer about how quickly they reply to messages.
export const SYNC_ASYNC_COLUMN = "REPLACE_SYNC_ASYNC_COLUMN"; // The synchronous or asynchronous communication answer.
export const EMOTIONAL_ENERGY_COLUMN = "REPLACE_EMOTIONAL_ENERGY_COLUMN"; // The emotional energy answer.
export const SELF_CARE_COLUMN = "REPLACE_SELF_CARE_COLUMN"; // The self-care answer.
export const ASSERTIVENESS_COLUMN = "REPLACE_ASSERTIVENESS_COLUMN"; // The assertiveness answer.
export const INSISTENCE_COLUMN = "REPLACE_INSISTENCE_COLUMN"; // The insistence answer.
export const RESTLESSNESS_COLUMN = "REPLACE_RESTLESSNESS_COLUMN"; // The restlessness answer.
export const SOCIAL_USUAL_COLUMN = "REPLACE_SOCIAL_USUAL_COLUMN"; // The "Social - usual" answer.
export const EMOTIONAL_USUAL_COLUMN = "REPLACE_EMOTIONAL_USUAL_COLUMN"; // The "Emotional - usual" answer.
export const SELF_CARE_USUAL_COLUMN = "REPLACE_SELF_CARE_USUAL_COLUMN"; // The "SelfC - usual" answer.
export const INSISTENCE_USUAL_COLUMN = "REPLACE_INSISTENCE_USUAL_COLUMN"; // The "Insistence - usual" answer.
export const WRITING_SAMPLE_COLUMN = "REPLACE_WRITING_SAMPLE_COLUMN"; // The column the writing sample from Slack is saved to.
export const SUMMARY_COLUMN = "REPLACE_SUMMARY_COLUMN"; // The column the AI summary is saved to.
