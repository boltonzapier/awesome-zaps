export default {
  app: "zapier-tables",
  event: "new_record",
  connection: "zapier-tables",
  params: {
    // Ask the user which Zapier Tables table is the hiring materials tracker, then look up its ID with their Zapier Tables connection. The same value as TABLE_ID in config.ts.
    table_id: "REPLACE_TABLE_ID",
  },
};
