// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const ZOOM_HOST_NAME = "REPLACE_ZOOM_HOST_NAME"; // Ask the user for their name exactly as it appears in their Zoom profile. The transcript labels speakers by name, so this is how the Zap finds the manager's talk time.
export const ONE_ON_ONE_TITLE_TEXT = "REPLACE_ONE_ON_ONE_TITLE_TEXT"; // Ask the user which words their one-on-one meeting titles contain, such as "1:1". Only recordings whose topic contains this text (case-insensitive) are coached.
export const FEEDBACK_TABLE_ID = "REPLACE_FEEDBACK_TABLE_ID"; // Ask the user which Zapier Table should hold the coaching log, then look up its ID (the long ID in the table's URL) with their Zapier Tables connection.
export const SLACK_USER_ID = "REPLACE_SLACK_USER_ID"; // Ask the user for their Slack user ID (starts with U), then look it up with their Slack connection. The coaching DM is sent to this user.

// Feedback log column keys (f1 = first column). Map them to the user's columns before building.
export const FEEDBACK_COLUMNS = {
  // Column holding the meeting topic.
  title: "f1",
  // Column holding the date the meeting was recorded.
  date: "f2",
  // Column holding the coaching feedback (overall assessment, strengths, areas for improvement).
  feedback: "f3",
  // Column holding the meeting recap (discussion points, feedback given, action items).
  recap: "f4",
} as const;

// Seconds to wait after the recording completes, so Zoom has time to generate the audio transcript.
export const TRANSCRIPT_WAIT_SECONDS = 1800;

// AI model tier; "premium/auto" lets AI by Zapier pick an available model.
export const AI_MODEL_ID = "premium/auto";
// "0" uses Zapier-managed AI credentials.
export const AI_AUTHENTICATION_ID = "0";
