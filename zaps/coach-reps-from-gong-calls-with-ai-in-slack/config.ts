// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TEAM_DIRECTORY_TABLE_ID = "REPLACE_TEAM_DIRECTORY_TABLE_ID"; // Ask the user which Zapier Table lists each rep with their email, Slack user ID and manager, then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.
export const FEEDBACK_LOG_TABLE_ID = "REPLACE_FEEDBACK_LOG_TABLE_ID"; // Ask the user which Zapier Table should hold the call feedback, then look up its ID with their Zapier Tables connection.
export const GONG_API_BASE_URL = "REPLACE_GONG_API_BASE_URL"; // Ask the user for the API base URL shown in their Gong API settings (for example https://us-1234.api.gong.io).

// Team directory column keys (f1 = first column). Map them to the user's columns before building.
export const TEAM_EMAIL_FIELD = "f1";
// Column holding the rep's name, copied into each feedback row.
export const TEAM_NAME_FIELD = "f2";
// Column holding each team member's Slack user ID; feedback is sent to that ID.
export const TEAM_SLACK_ID_FIELD = "f4";
// Column holding the email of the rep's manager; the manager is looked up in the same table.
export const TEAM_MANAGER_EMAIL_FIELD = "f6";
// Column with a rep's own coaching focus; blank means no custom area is scored.
export const TEAM_CUSTOM_COACHING_FIELD = "f7";

// Feedback log column keys, in table order.
export const FEEDBACK_COLUMNS = {
  title: "f1",
  call_date: "f2",
  call_url: "f3",
  rep_name: "f4",
  rep_email: "f5",
  feedback_summary: "f6",
  total_score: "f7",
  call_opening_score: "f8",
  call_opening_feedback: "f9",
  questioning_score: "f10",
  questioning_feedback: "f11",
  rapport_score: "f12",
  rapport_feedback: "f13",
  value_score: "f14",
  value_feedback: "f15",
  commitment_score: "f16",
  commitment_feedback: "f17",
  flow_score: "f18",
  flow_feedback: "f19",
  talk_ratio_stat: "f20",
  talk_ratio_feedback: "f21",
  longest_monologue_stat: "f22",
  longest_monologue_feedback: "f23",
  longest_customer_story_stat: "f24",
  longest_customer_story_feedback: "f25",
  interactivity_stat: "f26",
  interactivity_feedback: "f27",
  patience_stat: "f28",
  patience_feedback: "f29",
  custom_coaching_feedback: "f30",
} as const;

// Calls this long or shorter (in seconds) are skipped.
export const MIN_CALL_SECONDS = 600;
// Calls whose six criteria add up to less than this (out of 30) also notify the rep's manager.
export const ESCALATION_SCORE = 15;

// AI model tier; "premium/auto" lets AI by Zapier pick an available model.
export const AI_MODEL_ID = "premium/auto";
// "0" uses Zapier-managed AI credentials.
export const AI_AUTHENTICATION_ID = "0";
