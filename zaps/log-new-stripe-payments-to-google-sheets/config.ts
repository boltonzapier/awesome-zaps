// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which sheet is the payments tracker, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection.

// Worksheet (tab) ID; the first tab is "0".
export const WORKSHEET_ID = "0";
// Column for the time the payment was logged (COL$A = column A).
export const LOGGED_AT_COLUMN = "COL$A";
// Column for the Stripe payment ID.
export const PAYMENT_ID_COLUMN = "COL$B";
// Column for when Stripe created the payment.
export const CREATED_AT_COLUMN = "COL$C";
// Column for the amount, in Stripe's smallest currency unit (cents for USD).
export const AMOUNT_COLUMN = "COL$D";
// Column for the three-letter currency code.
export const CURRENCY_COLUMN = "COL$E";
// Column for the payment status, such as succeeded.
export const STATUS_COLUMN = "COL$F";
// Column for the customer's email address.
export const CUSTOMER_EMAIL_COLUMN = "COL$G";
// Column for the payment description.
export const DESCRIPTION_COLUMN = "COL$H";
