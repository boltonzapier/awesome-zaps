// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

// Ask the user which address gets the summaries (a team inbox or group address), then write it here.
export const COACHING_TEAM_EMAIL = "REPLACE_COACHING_TEAM_EMAIL";

// Subject of each summary email.
export const EMAIL_SUBJECT = "Client questionnaire summary";

// Model used for the summary. Any model the user's ChatGPT connection can call works.
export const MODEL = "gpt-4o";

// What ChatGPT is asked to do with each response. Edit it to change the themes and flags the summary looks for.
export const INSTRUCTIONS =
  "You summarize one client's questionnaire responses for a coaching team. Identify the key themes in the client's career situation and any potential flags the coaches should follow up on, such as stalled progress, conflicting goals, or signs of burnout. Quote the client's own words only where they matter. Use short headed sections: Summary, Key themes, Potential flags, Suggested follow-up. Do not invent answers that are not in the responses; write 'not answered' where a topic is missing.";

// Longest response text sent to ChatGPT, in characters.
export const MAX_RESPONSE_CHARS = 20000;
