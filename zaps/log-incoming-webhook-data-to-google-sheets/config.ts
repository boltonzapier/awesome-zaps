// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which sheet receives the webhook data, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection.

// Worksheet (tab) ID; the first tab is "0".
export const WORKSHEET_ID = "0";
// Column for the time the request was received (COL$A = column A).
export const RECEIVED_AT_COLUMN = "COL$A";
// Column for the request's JSON payload, stored as text so any shape of request fits.
export const PAYLOAD_COLUMN = "COL$B";
