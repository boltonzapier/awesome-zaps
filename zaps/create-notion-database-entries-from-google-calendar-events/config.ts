// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const DATA_SOURCE = "REPLACE_DATA_SOURCE"; // Ask the user which Notion database receives the events, then look up its data source ID with their Notion connection. The database must be shared with that connection first.
export const STATUS_VALUE = "REPLACE_STATUS_VALUE"; // Ask the user which option the Status property gives new events (for example "Scheduled"), then check that option name in their Notion database.

// Title property of the database; it takes the event name.
export const TITLE_PROPERTY = "Name";
// Date property of the database; it takes the event's start.
export const DATE_PROPERTY = "Date";
// Property that takes the event's location as the space requirement. Change it to the database's property name.
export const SPACE_PROPERTY = "Space requirements";
// Status property of the database. Change it to the database's property name.
export const STATUS_PROPERTY = "Status";
