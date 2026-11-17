// What starts the zap: a new message posted to the help channel.
export default {
  app: "slack",
  event: "channel_message",
  connection: "slack",
  params: {
    // Ask the user which channel employees post questions in, then look up its ID (C…) with their Slack connection. The same value as SLACK_CHANNEL_ID in config.ts.
    channel: "REPLACE_SLACK_CHANNEL_ID",
    listen_for_bots: false,
    raw: "no",
  },
};
