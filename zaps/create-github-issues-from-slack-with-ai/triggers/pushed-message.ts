export default {
  app: "slack",
  event: "pushed_message_v2",
  connection: "slack",
  params: {
    // Name shown for this automation in Slack. Any label works.
    name: "Create GitHub issue",
    // Who can push a message to this automation. "workspace" lets anyone in the workspace use it.
    access_type: "workspace",
    // Extra data Slack sends with the message: the text, its author, its channel and its link.
    enrichments: ["text", "user", "channel", "permalink"],
  },
};
