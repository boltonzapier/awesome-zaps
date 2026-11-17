// What starts the zap: the "Send" button on a record in the sales table.
export default {
  app: "zapier-tables",
  event: "button_click_record",
  connection: "zapier-tables",
  params: {
    table_id: "REPLACE_TABLE_ID", // Ask the user which table holds the daily sales records, then look up its ID with their Zapier Tables connection.
  },
};
