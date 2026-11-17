// This zap's settings. Each "REPLACE_…" value is set per person before building; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which sheet holds warranty registrations, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection. The trigger watches it.
export const WORKSHEET_ID = "REPLACE_WORKSHEET_ID"; // Ask the user which tab of that sheet holds the registrations, then pick its ID with the same connection. Worksheets must have column headers.
export const CUSTOMER_NAME_HEADER = "REPLACE_CUSTOMER_NAME_HEADER"; // Ask the user which column header holds the customer's name, exactly as it is written in the sheet's first row.
export const CUSTOMER_EMAIL_HEADER = "REPLACE_CUSTOMER_EMAIL_HEADER"; // Ask the user which column header holds the customer's email address, exactly as it is written in the sheet's first row.
export const DISCOUNT_CODE = "REPLACE_DISCOUNT_CODE"; // Ask the user for the discount code to offer registered customers. It is written into every email.

// Subject line of the confirmation email.
export const EMAIL_SUBJECT = "Your warranty is registered";
