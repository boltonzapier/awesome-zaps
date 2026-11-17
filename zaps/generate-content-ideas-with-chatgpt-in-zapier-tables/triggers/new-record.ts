export default {
  app: "zapier-tables",
  event: "new_record",
  connection: "zapier-tables",
  params: {
    // Ask the user which Zapier Tables table holds their ideas, then look up its ID with their Zapier Tables connection (the table ID in the table's URL). The same value as TABLE_ID in config.ts.
    table_id: "REPLACE_TABLE_ID",
  },
};
