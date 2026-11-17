// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which sheet collects the leads, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection.

// Worksheet (tab) ID; the first tab is "0".
export const WORKSHEET_ID = "0";
// Model for the name analysis. standard/auto lets Zapier pick an account-usable model in that tier.
export const MODEL_ID = "standard/auto";

// Columns the lead's values are written to. COL$A is column A; map each one to the sheet's headers.
export const COLUMN_LEAD_ID = "COL$A";
export const COLUMN_CREATED_AT = "COL$B";
export const COLUMN_FULL_NAME = "COL$C";
export const COLUMN_EMAIL = "COL$D";
export const COLUMN_PHONE = "COL$E";
export const COLUMN_FIRST_NAME = "COL$F";
export const COLUMN_LAST_NAME = "COL$G";
export const COLUMN_NAME_TYPE = "COL$H";
export const COLUMN_NAME_NOTE = "COL$I";
