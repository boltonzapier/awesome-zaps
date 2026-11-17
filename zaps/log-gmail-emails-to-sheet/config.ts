// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which sheet is the email tracker, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection.

// Worksheet (tab) ID; the first tab is "0".
export const WORKSHEET_ID = "0";
// Column for the time the email was logged (COL$A = column A).
export const LOGGED_AT_COLUMN = "COL$A";
// Column for the Gmail message ID.
export const MESSAGE_ID_COLUMN = "COL$B";
// Column for the sender's name.
export const SENDER_NAME_COLUMN = "COL$C";
// Column for the sender's email address.
export const SENDER_EMAIL_COLUMN = "COL$D";
// Column for the email subject.
export const SUBJECT_COLUMN = "COL$E";
// Column for the short preview text Gmail shows for the email.
export const SNIPPET_COLUMN = "COL$F";
