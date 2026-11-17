export default {
  app: "google-forms",
  event: "new_form_response",
  connection: "google-forms",
  params: {
    // Ask the user which Google Form collects leads, then look up its ID (the long ID in the form's URL) with their Google Forms connection.
    formId: "REPLACE_GOOGLE_FORM_ID",
  },
};
