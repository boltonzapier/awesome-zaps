// What starts the zap: a new email in the watched label or mailbox.
export default {
  app: "gmail",
  event: "message",
  connection: "gmail",
  params: {
    // Ask the user which label or mailbox to watch, then set its ID here. Use INBOX for the inbox.
    // Left empty, the trigger fires on every email, including drafts.
    label_ids: "REPLACE_LABEL_ID",
  },
};
