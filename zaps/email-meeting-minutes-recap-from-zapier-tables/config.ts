// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Tables table holds the meeting minutes, then look up its ID with their Zapier Tables connection (the table ID in the table's URL). The trigger watches it.
export const RECAP_EMAIL = "REPLACE_RECAP_EMAIL"; // Ask the user which address gets the recap, usually their own, or a shared inbox or comma-separated list for the whole team. Use it as typed.

// Subject and sender name of the recap email.
export const EMAIL_SUBJECT = "Meeting minutes recap";
export const EMAIL_FROM_NAME = "Meeting minutes recap";

// Field keys of the meeting minutes table, as the trigger delivers them under new.data.
export const DATE_FIELD = "f1";
export const MEETING_TITLE_FIELD = "f2";
export const ATTENDEES_FIELD = "f3";
export const KEY_POINTS_FIELD = "f4";
export const DECISIONS_FIELD = "f5";
export const ACTION_ITEMS_FIELD = "f6";
export const OWNER_FIELD = "f7";
