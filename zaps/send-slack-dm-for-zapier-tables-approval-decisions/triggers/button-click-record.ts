export default {
  app: "zapier-tables",
  event: "button_click_record",
  connection: "zapier-tables",
  params: {
    // Ask the user which table holds the approval requests, then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.
    table_id: "REPLACE_TABLE_ID",
  },
};
