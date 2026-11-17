export default {
  app: "google-sheets",
  event: "updated_row_notify_hook",
  connection: "google-sheets",
  params: {
    // Ask the user which sheet holds warranty registrations, then look up its ID with their Google Sheets connection. The same value as SPREADSHEET_ID in config.ts.
    spreadsheet: "REPLACE_SPREADSHEET_ID",
    // Ask the user which tab holds the registrations, then pick its ID with the same connection. The same value as WORKSHEET_ID in config.ts.
    worksheet: "REPLACE_WORKSHEET_ID",
  },
};
