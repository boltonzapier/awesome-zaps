// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const REPORT_EMAIL = "REPLACE_REPORT_EMAIL"; // Ask the user which address gets the daily report, then use it as typed.
export const DATE_FIELD = "REPLACE_DATE_FIELD_KEY"; // Ask the user which table the report comes from, then look up the key of its Date field with their Zapier Tables connection (the key, not the name).
export const PRODUCT_NAME_FIELD = "REPLACE_PRODUCT_NAME_FIELD_KEY"; // Look up the key of the Product Name field in that table with the user's Zapier Tables connection.
export const QUANTITY_SOLD_FIELD = "REPLACE_QUANTITY_SOLD_FIELD_KEY"; // Look up the key of the Quantity Sold field in that table with the user's Zapier Tables connection.
export const SALES_REVENUE_FIELD = "REPLACE_SALES_REVENUE_FIELD_KEY"; // Look up the key of the Sales Revenue field in that table with the user's Zapier Tables connection.
export const CUSTOMER_FEEDBACK_FIELD = "REPLACE_CUSTOMER_FEEDBACK_FIELD_KEY"; // Look up the key of the Customer Feedback field in that table with the user's Zapier Tables connection.

// Subject and sender name of the report email.
export const EMAIL_SUBJECT = "Daily Sales Report";
export const EMAIL_FROM_NAME = "Daily Sales Report";
