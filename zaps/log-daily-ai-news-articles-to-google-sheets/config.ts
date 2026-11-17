// This zap's settings. Each "REPLACE_…" value is set per person before building; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which Google Sheet logs the AI news, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection.

// Worksheet (tab) ID; the first tab is "0". The tab needs column headers.
export const WORKSHEET_ID = "0";
// Column for the article's publication date (COL$A = column A).
export const DATE_COLUMN = "COL$A";
// Column for the article title.
export const TITLE_COLUMN = "COL$B";
// Column for the article link.
export const LINK_COLUMN = "COL$C";
// Column for the clickbait headline the AI wrote.
export const HEADLINE_COLUMN = "COL$D";
// Column for the AI's skimmable summary.
export const SUMMARY_COLUMN = "COL$E";

// AI model for the search. "premium/auto" lets Zapier pick a model the account can use in that tier; web search needs a tool-capable model.
export const MODEL_ID = "premium/auto";
