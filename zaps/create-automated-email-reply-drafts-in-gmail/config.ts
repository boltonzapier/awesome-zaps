// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const CALENDAR_ID = "REPLACE_CALENDAR_ID"; // Ask the user which calendar shows their availability (usually their own email address), then look up its ID with their Google Calendar connection.

// Gmail search for the user's sent mail. The AI reads what it finds to match the user's tone.
export const SENT_MAIL_QUERY = "in:sent";
// How far ahead the calendar is read when a sender asks to meet.
export const CALENDAR_LOOKAHEAD = "+2 weeks";
// Time zone the suggested meeting times are written in.
export const MEETING_TIME_ZONE = "America/Chicago";
// Model tier for the AI step. "premium/auto" lets AI by Zapier pick an account-usable model in that tier.
export const MODEL_ID = "premium/auto";
