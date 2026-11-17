export default {
  app: "slack",
  event: "channel_message",
  connection: "slack",
  params: {
    // Ask the user which channel IT requests are posted in, then look up its ID (C…) with their Slack connection. The same value as SLACK_CHANNEL_ID in config.ts.
    channel: "REPLACE_SLACK_CHANNEL_ID",
    listen_for_bots: false,
    raw: "no",
  },
};
