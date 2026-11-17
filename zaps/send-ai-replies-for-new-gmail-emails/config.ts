// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const RECIPIENT_EMAIL = "REPLACE_RECIPIENT_EMAIL"; // Ask the user which address should receive the generated replies. Use it as given; it is not looked up.

// Gemini model that writes the reply. Check it appears in the Google AI Studio model list for the account before deploying.
export const AI_MODEL = "gemini-2.5-flash";
