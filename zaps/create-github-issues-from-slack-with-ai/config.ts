// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const GITHUB_REPO = "REPLACE_GITHUB_REPO"; // Ask the user which repository the issues go in, as owner/name (for example acme/web). Check it with their GitHub connection; the connection needs access to it.

// AI model that drafts the issue. "standard/auto" lets Zapier pick an account-usable model.
export const MODEL_ID = "standard/auto";
