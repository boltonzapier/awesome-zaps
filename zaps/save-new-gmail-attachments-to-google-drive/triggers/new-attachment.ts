// What starts the zap: a new Gmail email with an attachment. Empty params watch the whole mailbox.
export default {
  app: "gmail",
  event: "attachment",
  connection: "gmail",
  params: {},
};
