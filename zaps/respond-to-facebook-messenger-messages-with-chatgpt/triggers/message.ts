export default {
  app: "facebook-messenger",
  event: "message",
  connection: "facebook-messenger",
  params: {
    page: "REPLACE_PAGE_ID", // Look up the page's ID from the page list on the user's Facebook Messenger connection. The same value goes in PAGE_ID in config.ts.
  },
};
