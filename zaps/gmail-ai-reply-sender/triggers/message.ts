// What starts the zap: a new email in the watched Gmail label or mailbox.
export default {
  app: "gmail",
  event: "message",
  connection: "gmail",
  params: {
    // Ask the user which Gmail label or mailbox to watch (Inbox is the usual choice), then look up its ID with their Gmail connection. Without one, the trigger fires on every email, including drafts.
    label_ids: "REPLACE_LABEL_ID",
  },
};
