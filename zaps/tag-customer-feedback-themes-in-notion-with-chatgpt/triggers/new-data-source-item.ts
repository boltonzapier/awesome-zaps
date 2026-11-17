export default {
  app: "notion",
  event: "new_data_source_item",
  connection: "notion",
  params: {
    // Ask the user which Notion database holds the feedback, then look up its data source ID with their Notion connection. The same value as NOTION_DATA_SOURCE_ID in config.ts.
    datasource: "REPLACE_NOTION_DATA_SOURCE_ID",
  },
};
