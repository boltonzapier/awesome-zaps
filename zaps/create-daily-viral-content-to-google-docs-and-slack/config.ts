// This zap's settings. Each "REPLACE_…" value is set per person before building; its comment says how to get it.
// The other values are defaults you can change.

export const BUSINESS_NICHE = "REPLACE_BUSINESS_NICHE"; // Ask the user which niche their videos cover, in a few words, for example "home coffee brewing". The AI looks for trends in it.
export const SLACK_RECIPIENT_ID = "REPLACE_SLACK_USER_ID"; // Ask the user who gets the daily message, then look up their Slack user ID (U…) with their Slack connection. The message is posted to that user's direct messages.
export const SHARING_PREFERENCE = "REPLACE_SHARING_PREFERENCE"; // Ask the user who can open the document, then pick one key from the list in SKILL.md. Use an organization or link-only key rather than a public one unless they ask for public.

// AI model for the draft. "premium/auto" lets Zapier pick a model the account can use in that tier.
export const MODEL_ID = "premium/auto";
// Start of each document's title; the run's date is added after it.
export const DOC_TITLE_PREFIX = "Viral content";
