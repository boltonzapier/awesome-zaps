// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const BUSINESS_NAME = "REPLACE_BUSINESS_NAME"; // Ask the user the name the replies should be signed as, such as their business or page name. The assistant uses it in its instructions.

export const PAGE_ID = "REPLACE_PAGE_ID"; // Look up the page's ID from the page list on the user's Facebook Messenger connection (the same page the trigger listens to). Messages sent by this ID are the page's own replies.

// Model that writes the replies.
export const DEFAULT_MODEL = "gpt-4o";
// Seconds to wait before each check of the ChatGPT response, and how many checks to make before giving up.
export const POLL_INTERVAL_SECONDS = 30;
export const MAX_POLLS = 20;

export const SYSTEM_INSTRUCTIONS = `You answer customer messages sent to the Facebook Messenger page of ${BUSINESS_NAME}. Reply in the same language as the customer, in a friendly, concise tone of two to four sentences. Answer what the customer asked. If the answer depends on information you do not have, say a team member will follow up rather than inventing details. Reply with the message text only, with no greeting label or explanation.`;
