export default {
  app: "zapier-tables",
  event: "button_click_record",
  connection: "zapier-tables",
  params: {
    // Ask the user which Zapier Tables table holds the project plan, then look up its ID with their Zapier Tables connection. Same answer as TABLE_ID in config.ts.
    table_id: "REPLACE_TABLE_ID",
    // Ask the user for the field key of the Send Update button column, then look it up with the same connection. The button is the one that starts the update.
    field_data_key: "REPLACE_BUTTON_FIELD_KEY",
  },
};
