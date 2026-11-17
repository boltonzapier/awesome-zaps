// This zap's settings. Each "REPLACE_…" value is set per person before building; its comment says how to get it.
// The other values are defaults you can change.

// The Google Form employees are offboarded from.
export const FORM_ID = "REPLACE_FORM_ID"; // Ask the user which Google Form is the resignations and terminations form, then look up its ID (the long ID in its URL) with their Google Forms connection.

// The Zapier Table that keeps one row per termination.
export const TERMINATIONS_TABLE_ID = "REPLACE_TERMINATIONS_TABLE_ID"; // Ask the user which Zapier Table holds terminations, then look up its ID with their Zapier Tables connection.

// The table's column keys, one per field written to it. Look each key up with the user's Zapier Tables connection, from the column whose name is shown in the comment.
export const COL_FULL_NAME = "REPLACE_COL_FULL_NAME"; // Key of the column "Employee full name".
export const COL_LAST_DAY = "REPLACE_COL_LAST_DAY"; // Key of the column "Last day".
export const COL_COMPANY_EMAIL = "REPLACE_COL_COMPANY_EMAIL"; // Key of the column "Company email".
export const COL_PERSONAL_EMAIL = "REPLACE_COL_PERSONAL_EMAIL"; // Key of the column "Personal email".
export const COL_TERM_TYPE = "REPLACE_COL_TERM_TYPE"; // Key of the column "Termination type".
export const COL_JOB_LEVEL = "REPLACE_COL_JOB_LEVEL"; // Key of the column "Job level".
export const COL_REASON = "REPLACE_COL_REASON"; // Key of the column "Reason".
export const COL_REHIRE = "REPLACE_COL_REHIRE"; // Key of the column "Would you rehire this employee?".

// Slack channels that receive each team's notice. Each is a channel ID (C… for public, G… for private).
export const PAYROLL_CHANNEL_ID = "REPLACE_PAYROLL_CHANNEL_ID"; // Ask the user which channel payroll reads, then look up its ID with their Slack connection.
export const IT_CHANNEL_ID = "REPLACE_IT_CHANNEL_ID"; // Ask the user which channel IT reads for access removal, then look up its ID with their Slack connection.
export const ACCOUNTING_CHANNEL_ID = "REPLACE_ACCOUNTING_CHANNEL_ID"; // Ask the user which channel accounting reads, then look up its ID with their Slack connection.
export const TOTAL_REWARDS_CHANNEL_ID = "REPLACE_TOTAL_REWARDS_CHANNEL_ID"; // Ask the user which channel total rewards reads, then look up its ID with their Slack connection.
export const TAX_CHANNEL_ID = "REPLACE_TAX_CHANNEL_ID"; // Ask the user which public channel tax reads, then look up its ID with their Slack connection.

// The Slack user ID of the employee's People Business Partner, mentioned in the payroll notice.
export const PBP_SLACK_USER_ID = "REPLACE_PBP_SLACK_USER_ID"; // Ask the user whose Slack account is the People Business Partner, then look up their user ID (U…) with their Slack connection.
