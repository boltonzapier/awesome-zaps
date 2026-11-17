// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which Google Sheet is the expense log, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection.

// Worksheet (tab) ID; the first tab is "0".
export const WORKSHEET_ID = "0";
// Model used to read each receipt image and to pull out its fields.
export const MODEL_ID = "gpt-4o";

// Column for the time the receipt was logged (COL$A = column A).
export const LOGGED_AT_COLUMN = "COL$A";
// Column for the Google Drive file ID.
export const FILE_ID_COLUMN = "COL$B";
// Column for the file name.
export const FILE_NAME_COLUMN = "COL$C";
// Column for the link that opens the receipt in Google Drive.
export const FILE_LINK_COLUMN = "COL$D";
// Column for the merchant name.
export const MERCHANT_COLUMN = "COL$E";
// Column for the date printed on the receipt.
export const RECEIPT_DATE_COLUMN = "COL$F";
// Column for the total amount.
export const TOTAL_COLUMN = "COL$G";
// Column for the currency code.
export const CURRENCY_COLUMN = "COL$H";
// Column for the expense category.
export const CATEGORY_COLUMN = "COL$I";
