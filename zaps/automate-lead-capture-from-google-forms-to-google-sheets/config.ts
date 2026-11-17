// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const SPREADSHEET_ID = "REPLACE_SPREADSHEET_ID"; // Ask the user which Google Sheet is the lead CRM, then look up its ID (the long ID in the sheet's URL) with their Google Sheets connection.
// Worksheet (tab) holding the lead CRM; the first tab is "0".
export const CRM_WORKSHEET_ID = "0";
export const INCOMPLETE_WORKSHEET_ID = "REPLACE_INCOMPLETE_WORKSHEET_ID"; // Ask the user to add an "Incomplete Leads" tab to the CRM sheet, then look up its worksheet ID with their Google Sheets connection.

// The form question each lead field is read from, by its exact title as it appears in the form.
export const FORM_QUESTIONS = {
  name: "REPLACE_FORM_QUESTION_NAME", // Ask the user which form question asks for the lead's full name, and copy its exact title.
  email: "REPLACE_FORM_QUESTION_EMAIL", // Ask the user which form question asks for the lead's email address, and copy its exact title.
  phone: "REPLACE_FORM_QUESTION_PHONE", // Ask the user which form question asks for a phone number, and copy its exact title. If the form has none, write a question title that never appears so the column stays blank.
  company: "REPLACE_FORM_QUESTION_COMPANY", // Ask the user which form question asks for the company name, and copy its exact title. Same blank rule as the phone question.
  source: "REPLACE_FORM_QUESTION_SOURCE", // Ask the user which form question asks how the lead found them, and copy its exact title. Same blank rule as the phone question.
};

// Columns in the CRM sheet and the Incomplete Leads tab (COL$A = column A).
export const COLUMNS = {
  submittedAt: "COL$A",
  name: "COL$B",
  email: "COL$C",
  phone: "COL$D",
  company: "COL$E",
  source: "COL$F",
  status: "COL$G",
  leadScore: "COL$H",
  followUpAt: "COL$I",
};

// One or two sentences about the company, placed under the greeting in every welcome email.
export const COMPANY_INTRO = "REPLACE_COMPANY_INTRO"; // Ask the user for a short description of their company and its main benefits.

// The scheduling page a lead uses to book a consultation or demo.
export const BOOKING_LINK = "REPLACE_BOOKING_LINK"; // Ask the user for their booking link (for example a Calendly page for consultations).

// The sales team member who gets an alert for every new lead.
export const SALES_EMAIL = "REPLACE_SALES_EMAIL"; // Ask the user which sales team member gets new-lead alerts, then use their email address.

// The calendar that holds the follow-up reminders.
export const CALENDAR_ID = "REPLACE_CALENDAR_ID"; // Ask the user which calendar gets the follow-up reminders, then look up its ID with their Google Calendar connection (their own email address is the main calendar's ID).

// How long after the submission the follow-up reminder is set, and how long it lasts.
export const FOLLOW_UP_HOURS = 24;
export const FOLLOW_UP_MINUTES = 30;
