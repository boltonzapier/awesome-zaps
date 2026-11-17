export default {
  app: "slack",
  event: "mention_v2",
  connection: "slack",
  params: {
    // Ask the user which Slack user's mentions get answers (the support account or their own), then look up its ID (U…) with their Slack connection.
    user_id: "REPLACE_SLACK_USER_ID",
    listen_for_bots: false,
    public_only: true,
  },
};
