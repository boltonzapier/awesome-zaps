// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const REORDER_EMAIL = "REPLACE_REORDER_EMAIL"; // Ask the user which address gets reorder requests (their own, or a supplier's), then use it as typed.
export const ITEM_FIELD = "REPLACE_ITEM_FIELD_KEY"; // Ask the user which table holds the inventory, then look up the key of its Item field with their Zapier Tables connection (the key, not the name).
export const DESCRIPTION_FIELD = "REPLACE_DESCRIPTION_FIELD_KEY"; // Look up the key of the Description field in that table with the user's Zapier Tables connection.
export const VENDOR_FIELD = "REPLACE_VENDOR_FIELD_KEY"; // Look up the key of the Vendor field in that table with the user's Zapier Tables connection.
export const REORDER_QUANTITY_FIELD = "REPLACE_REORDER_QUANTITY_FIELD_KEY"; // Look up the key of the Reorder Quantity field in that table with the user's Zapier Tables connection.
export const NEED_MORE_FIELD = "REPLACE_NEED_MORE_FIELD_KEY"; // Look up the key of the Need More? checkbox field in that table with the user's Zapier Tables connection.
export const LAST_REORDER_NOTE_FIELD = "REPLACE_LAST_REORDER_NOTE_FIELD_KEY"; // Look up the key of the Last Reorder Note field in that table with the user's Zapier Tables connection.

// Subject and sender name of the reorder email.
export const EMAIL_SUBJECT = "New Reorder Request";
export const EMAIL_FROM_NAME = "Inventory Reorder";
