// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const NOTIFY_EMAIL = "REPLACE_NOTIFY_EMAIL"; // Ask the user for the address of the team member who should hear about each new lead. Use the address they want, and check it is their own or a teammate's.

// Subject prefix for the notification; the lead's name is appended.
export const SUBJECT_PREFIX = "New Facebook lead";
