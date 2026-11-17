// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const NOTION_DATA_SOURCE_ID = "REPLACE_NOTION_DATA_SOURCE_ID"; // Ask the user which Notion database holds the feedback, then look up its data source ID with their Notion connection. Use the data source ID, not the database ID in the page URL; they differ.
export const FEEDBACK_PROPERTY = "REPLACE_FEEDBACK_PROPERTY"; // Ask the user which property holds the feedback text, then use its key in the form "properties|||<Property name>|||<type>", the same form the Notion actions use.

// The multi-select property the theme tags are written to. Create it in the database with the options below, or change the name here.
export const THEME_PROPERTY = "properties|||Theme tags|||multi_select";

// The only tags the zap writes. Anything ChatGPT returns outside this list is dropped.
export const THEME_OPTIONS = [
  "Pricing",
  "Onboarding",
  "Performance",
  "Bugs",
  "Integrations",
  "Feature request",
  "Support",
  "Usability",
  "Documentation",
  "Other",
];

// Most tags written to one item.
export const MAX_THEMES = 3;

// Model used for the tagging. Any model the user's ChatGPT connection can call works.
export const MODEL = "gpt-4o";

// What ChatGPT is asked to do with each item. Edit it to change how feedback is tagged.
export const INSTRUCTIONS =
  "You tag one piece of customer feedback with the themes it covers. Choose only from this list: " +
  THEME_OPTIONS.join(", ") +
  `. Pick at most ${MAX_THEMES} themes, and only ones the feedback clearly raises. Reply with only a JSON array of theme names, for example ["Pricing", "Bugs"]. If no theme fits, reply with [].`;

// Longest feedback text sent to ChatGPT, in characters.
export const MAX_FEEDBACK_CHARS = 8000;
