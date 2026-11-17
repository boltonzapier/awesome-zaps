export default {
  app: "google-forms",
  event: "new_form_response",
  connection: "google-forms",
  params: {
    // Ask the user which Google Form holds the client questionnaire, then pick it from the form list on their Google Forms connection (its ID is the long ID in the form's URL).
    formId: "REPLACE_FORM_ID",
  },
};
