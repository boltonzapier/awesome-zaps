// What starts the zap: a new survey row added to the ReadMe table. Each new row is one employee's answers.
export default {
  app: "zapier-tables",
  event: "new_record",
  connection: "zapier-tables",
  params: {
    // Ask the user which table holds the survey answers, then look up its ID with their Zapier Tables connection. The same value as TABLE_ID in config.ts.
    table_id: "REPLACE_TABLE_ID",
  },
};
