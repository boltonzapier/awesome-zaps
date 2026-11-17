// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

// Model that writes each reply. Any model the user's ChatGPT connection can call works.
export const MODEL = "gpt-4o";

// What ChatGPT is asked to write for each review. Edit it to change the tone or the rules for replies.
export const INSTRUCTIONS =
  "You write the public reply a local business posts under one Google review. Write two to four short sentences in plain, warm English. Open by addressing the reviewer by their first name. For a positive review, thank them for something specific they mentioned. For a negative or mixed review, acknowledge the specific problem, apologise once, and invite them to get in touch; do not promise refunds, discounts or fixes. Never invent details that are not in the review, and do not mention the star rating. Reply with the reply text only, with no quotes or headings.";

// Used in place of the first name when the reviewer has no display name.
export const NAME_FALLBACK = "there";
