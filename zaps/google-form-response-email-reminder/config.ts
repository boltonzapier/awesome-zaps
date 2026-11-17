// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

// The form question that collects the respondent's email address. Open a sample response of the form, copy that question's exact title, and set it here.
export const EMAIL_FIELD = "REPLACE_EMAIL_FIELD";

// Subject of the reminder email.
export const EMAIL_SUBJECT = "We received your request";

// Body of the reminder email, as plain text. Edit it to list the responsibilities you want respondents to keep in mind.
export const EMAIL_BODY =
  "Thanks for your submission. We have received your request and will be in touch.\n\nPlease keep in mind your responsibilities: respond promptly to any follow-up questions and let us know if your details change.";
