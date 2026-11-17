export default {
  app: "slack",
  event: "new_reaction_added_v3",
  connection: "slack",
  params: {
    // The reaction that marks a message as a changelog entry. Create a custom Slack emoji named "changelog", or use another emoji name here.
    emoji: "changelog",
    // Without a message detail level the trigger sends no message text.
    message_detail: "content",
    // "user" adds the message author's details; "permalink" adds the link to the message.
    enrichments: ["user", "permalink"],
  },
};
