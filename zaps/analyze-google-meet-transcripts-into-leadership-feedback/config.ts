// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

// The leader being coached. The analysis is written about this person only.
export const CLIENT_NAME = "REPLACE_CLIENT_NAME"; // Ask the user for the full name of the leader whose meetings are analyzed.
export const CLIENT_TITLE = "REPLACE_CLIENT_TITLE"; // Ask the user for that leader's job title, for example Chief Information Officer.
export const CLIENT_COMPANY = "REPLACE_CLIENT_COMPANY"; // Ask the user for the name of the leader's company.

// Drive folder that each processed meeting doc moves into, so the trigger does not pick it up again.
export const PROCESSED_FOLDER_ID = "REPLACE_PROCESSED_FOLDER_ID"; // Ask the user which Drive folder processed docs should go to, then look up its ID (the long ID in the folder's URL) with their Google Drive connection.
// The Google Doc that collects every analysis. Each new analysis is appended to its end.
export const FEEDBACK_DOC_ID = "REPLACE_FEEDBACK_DOC_ID"; // Ask the user which Google Doc holds the feedback, then take its ID from the doc's URL (the long ID between /d/ and /edit).

// Model that writes the analysis. premium/auto lets AI by Zapier pick an account-usable model.
export const AI_MODEL = "premium/auto";
