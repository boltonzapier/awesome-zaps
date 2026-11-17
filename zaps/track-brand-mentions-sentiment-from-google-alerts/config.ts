// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Table holds the brand mentions, then take its ID from the table's URL.
export const SLACK_CHANNEL_ID = "REPLACE_SLACK_CHANNEL_ID"; // Ask the user which channel gets mention alerts, then look up its ID (C…) with their Slack connection.

// Table field keys for each column. Ask the user which column holds each value, then look up its field key with their Zapier Tables connection.
export const HEADLINE_FIELD = "REPLACE_HEADLINE_FIELD"; // Column for the article headline.
export const SUMMARY_FIELD = "REPLACE_SUMMARY_FIELD"; // Column for the AI summary of the article.
export const SENTIMENT_FIELD = "REPLACE_SENTIMENT_FIELD"; // Column for the sentiment of the mention.
export const QUOTES_FIELD = "REPLACE_QUOTES_FIELD"; // Column for direct quotes about the brand, with attribution.
export const ARTICLE_URL_FIELD = "REPLACE_ARTICLE_URL_FIELD"; // Column for the article link.
export const PUBLISHED_AT_FIELD = "REPLACE_PUBLISHED_AT_FIELD"; // Column for the article's publish date.
export const LOGGED_AT_FIELD = "REPLACE_LOGGED_AT_FIELD"; // Column for the time the mention was logged.

// Name the alert posts appear under in Slack.
export const BOT_NAME = "Brand Mentions";
// AI model used to read each article, as the AI by Zapier model tier.
export const MODEL_ID = "standard/auto";
// Longest article HTML sent to the AI; the rest is cut so the prompt and run journal stay small.
export const MAX_ARTICLE_CHARS = 20000;
