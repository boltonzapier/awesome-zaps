// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Tables table is the hiring materials tracker, then look up its ID (the table ID in the table's URL) with their Zapier Tables connection. The new-record trigger watches this table.
export const TEMPLATE_DOC_ID = "REPLACE_TEMPLATE_DOC_ID"; // Ask the user which Google Doc is the hiring material template, then look up its ID (the long ID in the doc's URL) with their Google Docs connection. Its placeholders must match the names in TEMPLATE_FIELDS below.

// Field keys for the columns in the tracker table. Look each one up with the user's Zapier Tables connection.
export const DEPARTMENT_FIELD = "REPLACE_DEPARTMENT_FIELD"; // Ask the user which column holds the department, then look up its field key.
export const ROLE_TITLE_FIELD = "REPLACE_ROLE_TITLE_FIELD"; // Ask the user which column holds the role title, then look up its field key.
export const ROLE_LEVEL_FIELD = "REPLACE_ROLE_LEVEL_FIELD"; // Ask the user which column holds the role level, then look up its field key.
export const LOCATION_FIELD = "REPLACE_LOCATION_FIELD"; // Ask the user which column holds the location, then look up its field key.
export const HIRING_MANAGER_EMAIL_FIELD = "REPLACE_HIRING_MANAGER_EMAIL_FIELD"; // Ask the user which column holds the hiring manager's email, then look up its field key.
export const RECRUITER_EMAIL_FIELD = "REPLACE_RECRUITER_EMAIL_FIELD"; // Ask the user which column holds the recruiter's email, then look up its field key.
export const INTAKE_NOTES_FIELD = "REPLACE_INTAKE_NOTES_FIELD"; // Ask the user which column holds the intake answers (hard and soft skills, team gaps, projects, why the role is exciting), then look up its field key. The drafts are written from it.
export const ABOUT_ROLE_FIELD = "REPLACE_ABOUT_ROLE_FIELD"; // Ask the user which column receives the drafted "About this role" text, then look up its field key.
export const ABOUT_YOU_FIELD = "REPLACE_ABOUT_YOU_FIELD"; // Ask the user which column receives the drafted "About you" text, then look up its field key.
export const THINGS_YOULL_DO_FIELD = "REPLACE_THINGS_YOULL_DO_FIELD"; // Ask the user which column receives the drafted "Things you'll do" text, then look up its field key.
export const APPLICATION_QUESTIONS_FIELD =
  "REPLACE_APPLICATION_QUESTIONS_FIELD"; // Ask the user which column receives the drafted application questions, then look up its field key.
export const INTERVIEW_QUESTIONS_FIELD = "REPLACE_INTERVIEW_QUESTIONS_FIELD"; // Ask the user which column receives the drafted interview questions, then look up its field key.
export const CHANNEL_FIELD = "REPLACE_CHANNEL_FIELD"; // Ask the user which column records the Slack channel name, then look up its field key.
export const DOCUMENT_LINK_FIELD = "REPLACE_DOCUMENT_LINK_FIELD"; // Ask the user which column records the link to the hiring material doc, then look up its field key.

// Folder for the new doc. "root" is the user's My Drive.
export const FOLDER_ID = "root";
// Anyone with the link can comment, not edit, so reviewers can suggest changes.
export const SHARING_PREFERENCE = "commenter";
// Shown at the top of every doc, so the drafts are never mistaken for reviewed copy.
export const MATERIAL_NOTE =
  "This content was generated with the help of AI. Please review it carefully and customize it to fit your specific role.";

// Model used for the drafts, and the AI by Zapier connection it runs on (included with the plan).
export const MODEL_ID = "standard/auto";
export const AI_AUTHENTICATION_ID = "0";

// Placeholder names in the template doc. The doc must use these names exactly.
export const TEMPLATE_FIELDS = {
  department: "template_field__Department",
  jobTitle: "template_field__JobTitle",
  jobLevel: "template_field__JobLevel",
  location: "template_field__Location",
  roleIntro: "template_field__RoleIntro",
  aboutYou: "template_field__AboutYou",
  thingsYoullDo: "template_field__ThingsYoullDo",
  applicationQuestions: "template_field__ApplicationQuestions",
  recruiterScreenQuestions: "template_field__RecruiterScreenQuestions",
  hiringManagerQuestions: "template_field__HiringManagerQuestions",
  skillsQuestions: "template_field__SkillsQuestions",
  chatTranscript: "template_field__ChatTranscript",
  materialNote: "template_field__MaterialNote",
} as const;
