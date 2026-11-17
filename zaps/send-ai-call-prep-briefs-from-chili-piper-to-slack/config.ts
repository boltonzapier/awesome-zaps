// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which Zapier Tables table keeps the call prep briefs, then look up its ID with their Zapier Tables connection. It is in the table's URL.
export const MEETING_NAME_FIELD = "REPLACE_MEETING_NAME_FIELD"; // Ask the user which column holds the meeting name, then look up its field key with their Zapier Tables connection.
export const MEETING_DATE_FIELD = "REPLACE_MEETING_DATE_FIELD"; // Ask the user which column holds the meeting date and time, then look up its field key with their Zapier Tables connection.
export const PREP_BRIEF_FIELD = "REPLACE_PREP_BRIEF_FIELD"; // Ask the user which column holds the generated brief, then look up its field key with their Zapier Tables connection.
export const COMPANY_NAME_FIELD = "REPLACE_COMPANY_NAME_FIELD"; // Ask the user which column holds the company name, then look up its field key with their Zapier Tables connection.
export const ATTENDEE_FIELD = "REPLACE_ATTENDEE_FIELD"; // Ask the user which column holds the guest's name, then look up its field key with their Zapier Tables connection.
export const HOST_FIELD = "REPLACE_HOST_FIELD"; // Ask the user which column holds the meeting host, then look up its field key with their Zapier Tables connection.
export const HUBSPOT_ACCOUNT_ID = "REPLACE_HUBSPOT_ACCOUNT_ID"; // Ask the user for their HubSpot account number, which appears in any HubSpot record URL after /contacts/.
export const SLACK_USER_ID = "REPLACE_SLACK_USER_ID"; // Ask the user whose Slack direct messages receive the brief, then look up their user ID (U…) with the user's Slack connection.

// OpenAI model that writes the brief.
export const MODEL = "gpt-4o";

// Sent with every brief. The output is posted to Slack and saved to the table, so it is plain text with light bold only.
export const BRIEF_INSTRUCTIONS = `You turn meeting, CRM and company data into a short call prep brief for a sales representative.
Start with a bold header that has the meeting name and date. Then four bold sections, in this order:
* Attendee: a short paragraph on who is attending.
* Company: a short paragraph on the customer's company.
* Meeting: a few bullets on the topic, time and location.
* Potential Use Cases: a few bullets on how this company could get value from Zapier.
Format bold as *bold* with single asterisks, never **double**. Use only the data provided. If a section has no data, say so in one line.`;

// Seconds to wait after the meeting is created, so HubSpot has the new contact before it is searched.
export const SYNC_WAIT_SECONDS = 300;

// The brief is delivered this long before the meeting starts.
export const BRIEF_LEAD_SECONDS = 24 * 60 * 60;
