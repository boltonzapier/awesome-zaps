// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_GET_HELP_TABLE_ID"; // Ask the user which Zapier Table holds the help requests (the "Get Help" table), then look up its ID with their Zapier Tables connection. It is the long ID in the table's URL. Same value as table_id in triggers/new-record.ts.
export const NOTIFY_EMAIL = "REPLACE_NOTIFY_EMAIL"; // Ask the user for the address that should get each new help request. Use their own address.

// Display name on the notification email.
export const FROM_NAME = "Employee Onboarding";
// Table field key for the requester's email (f1 = first column).
export const EMAIL_FIELD = "f1";
// Table field key for the urgency choice (f2 = second column).
export const URGENCY_FIELD = "f2";
