// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const GONG_API_BASE_URL = "REPLACE_GONG_API_BASE_URL"; // Ask the user for the API base URL shown in their Gong API settings (for example https://us-1234.api.gong.io).

// AI model tier; "premium/auto" lets AI by Zapier pick an available model.
export const AI_MODEL_ID = "premium/auto";
// "0" uses Zapier-managed AI credentials.
export const AI_AUTHENTICATION_ID = "0";

// HubSpot task created for the call owner, due after this many hours.
export const TASK_SUBJECT = "Call Follow Up";
export const TASK_DUE_HOURS = 24;
