// What starts the zap: the "Send Recap" button on a record in the meeting minutes table.
export default {
  app: "zapier-tables",
  event: "button_click_record",
  connection: "zapier-tables",
  params: {
    table_id: "REPLACE_TABLE_ID", // Ask the user which table holds the meeting minutes, then look up its ID with their Zapier Tables connection. The same value as TABLE_ID in config.ts.
    field_data_key: "data__f8", // The "Send Recap" button column in the template's table.
  },
};
