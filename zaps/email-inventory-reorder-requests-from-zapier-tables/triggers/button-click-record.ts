// What starts the zap: the "Send request" button on a record in the inventory table.
export default {
  app: "zapier-tables",
  event: "button_click_record",
  connection: "zapier-tables",
  params: {
    table_id: "REPLACE_TABLE_ID", // Ask the user which table holds the inventory, then look up its ID with their Zapier Tables connection.
    field_data_key: "REPLACE_BUTTON_FIELD_KEY", // Ask the user which field holds the "Send request" button, then look up its key with their Zapier Tables connection (the key, not the name).
  },
};
