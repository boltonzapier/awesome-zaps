export default {
  app: "google-forms",
  event: "new_form_response",
  connection: "google-forms",
  params: {
    // Ask the user which Google Form is the resignations and terminations form, then look up its ID (the long ID in its URL) with their Google Forms connection. The same value as FORM_ID in config.ts.
    formId: "REPLACE_FORM_ID",
  },
};
