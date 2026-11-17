export default {
  app: "gmail",
  event: "message",
  connection: "gmail",
  params: {
    // Fires for new mail in the inbox only, so drafts and sent mail do not start a reply.
    label_ids: "INBOX",
  },
};
