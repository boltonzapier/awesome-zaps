// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which sheet holds the job titles, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection. The trigger watches it.
export const WORKSHEET_ID = "REPLACE_WORKSHEET_ID"; // Ask the user which tab holds the job titles, then look up its ID with the same connection. The trigger watches it too.

// Column with the job title (COL$A = column A). Each new row's title is read from here.
export const TITLE_COLUMN = "COL$A";
// Column the department is written to. Keep it empty in the sheet so the result lands in its own column.
export const DEPARTMENT_COLUMN = "COL$B";

// Model that classifies each title.
export const CHATGPT_MODEL = "gpt-4o";
