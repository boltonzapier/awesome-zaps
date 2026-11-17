// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const ASANA_WORKSPACE_ID = "REPLACE_ASANA_WORKSPACE_ID"; // Ask the user which Asana workspace new tasks go in, then look up its ID with their Asana connection.
export const ASANA_PROJECT_ID = "REPLACE_ASANA_PROJECT_ID"; // Ask the user which Asana project the tasks go in, then look up its ID with the same Asana connection.
export const USER_NAME_AND_ROLE = "REPLACE_USER_NAME_AND_ROLE"; // Ask the user for their name and team or job, so the AI picks out the action items that belong to them.

// Model used to extract the action items.
export const AI_MODEL = "standard/auto";
