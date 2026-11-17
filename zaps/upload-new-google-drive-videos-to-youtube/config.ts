// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

// YouTube privacy for uploads: "private" keeps each video hidden until its owner reviews it. Use "unlisted" or "public" once the titles and descriptions are trusted.
export const YOUTUBE_PRIVACY = "private";
// Description used when the Drive file has none.
export const DEFAULT_DESCRIPTION = "Uploaded from Google Drive.";
// YouTube rejects titles longer than 100 characters.
export const TITLE_LENGTH = 100;
