// What starts the zap: the "Send email" button on a record in the expenses table.
export default {
  app: "zapier-tables",
  event: "button_click_record",
  connection: "zapier-tables",
  params: {
    table_id: "REPLACE_TABLE_ID", // Ask the user which table holds the expense records, then look up its ID with their Zapier Tables connection. The same value as TABLE_ID in config.ts.
    field_data_key: "data__f6", // The "Send to finance team" button column in the template's table.
  },
};
