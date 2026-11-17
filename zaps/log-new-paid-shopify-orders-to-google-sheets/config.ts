// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which sheet is the order log, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection.

// Worksheet (tab) ID; the first tab is "0".
export const WORKSHEET_ID = "0";
// Column for the time the order was logged (COL$A = column A).
export const LOGGED_AT_COLUMN = "COL$A";
// Column for the Shopify order ID.
export const ORDER_ID_COLUMN = "COL$B";
// Column for the order number shown to the customer, such as #1001.
export const ORDER_NAME_COLUMN = "COL$C";
// Column for the time the order was placed.
export const ORDER_DATE_COLUMN = "COL$D";
// Column for the customer's name from the billing address.
export const CUSTOMER_NAME_COLUMN = "COL$E";
// Column for the customer's email address.
export const CUSTOMER_EMAIL_COLUMN = "COL$F";
// Column for the sales channel the order came through (Online Store, Point of Sale, and so on).
export const SALES_CHANNEL_COLUMN = "COL$G";
// Column for the order currency code.
export const CURRENCY_COLUMN = "COL$H";
// Column for the total discount applied to the order.
export const DISCOUNT_COLUMN = "COL$I";
// Column for the items in the order, as quantity and title, separated by semicolons.
export const ITEMS_COLUMN = "COL$J";
