// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Tables table holds their ideas, then look up its ID with their Zapier Tables connection (the table ID in the table's URL). The trigger watches it and the generated ideas are saved to it.

// Column keys of that table. The template's Ideas table has these, in this order: Title, Details, Type of content, AI-generated, Status.
export const TITLE_FIELD = "f1";
export const DETAILS_FIELD = "f2";
export const TYPE_FIELD = "f3";
export const AI_GENERATED_FIELD = "f4";
export const STATUS_FIELD = "f5";

// Status written to every generated idea.
export const DRAFT_STATUS = "Draft";
// How many ideas to generate from each new idea.
export const IDEA_COUNT = 5;

// Model that writes the ideas.
export const DEFAULT_MODEL = "gpt-4o";
// Seconds to wait before each check of the ChatGPT response, and how many checks to make before giving up.
export const POLL_INTERVAL_SECONDS = 30;
export const MAX_POLLS = 20;

export const SYSTEM_INSTRUCTIONS = `You are a content idea generator. You receive one content idea with a title, some details and a type of content. Create ${IDEA_COUNT} additional content ideas that approach the original from different perspectives, angles and related topics. Each idea has a title, a short details paragraph, and the same type of content as the original.

Reply with only JSON in this exact shape, and nothing else:
{"ideas":[{"title":"...","details":"..."}]}`;
