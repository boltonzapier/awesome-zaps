// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Tables table holds the expense records, then look up its ID with their Zapier Tables connection (the table ID in the table's URL). The trigger watches it.
export const FINANCE_EMAIL = "REPLACE_FINANCE_EMAIL"; // Ask the user which address gets the reimbursement emails (the finance team), then use it as typed.

// Subject and sender name of the reimbursement email.
export const EMAIL_SUBJECT = "New Expense Submitted";
export const EMAIL_FROM_NAME = "Expense Tracker";

// Status written to the record when its button is clicked.
export const PENDING_STATUS = "Pending";

// Field keys of the expenses table, as the trigger delivers them under new.data.
export const DESCRIPTION_FIELD = "f1";
export const CATEGORY_FIELD = "f2";
export const AMOUNT_FIELD = "f3";
export const STATUS_FIELD = "f4";
export const DATE_FIELD = "f5";
