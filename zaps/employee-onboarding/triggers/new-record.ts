// What starts the zap: a new row in the Get Help table.
export default {
  app: "zapier-tables",
  event: "new_record",
  connection: "zapier-tables",
  params: {
    // Ask the user which Zapier Table holds the help requests, then look up its ID with their Zapier Tables connection. Same value as TABLE_ID in config.ts.
    table_id: "REPLACE_GET_HELP_TABLE_ID",
  },
};
