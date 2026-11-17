// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

export const FACEBOOK_BUSINESS_ID = "REPLACE_FACEBOOK_BUSINESS_ID"; // Ask the user which Meta business account sends the conversions, then look up its ID with their Facebook Conversions connection.
export const FACEBOOK_PIXEL_ID = "REPLACE_FACEBOOK_PIXEL_ID"; // Ask the user which Meta pixel receives the conversions, then look up its ID with the same connection.
export const LINKEDIN_ACCOUNT_ID = "REPLACE_LINKEDIN_ACCOUNT_ID"; // Ask the user which LinkedIn ad account sends the conversions, then look up its ID with their LinkedIn Conversions connection.
export const LINKEDIN_CONVERSION_ID = "REPLACE_LINKEDIN_CONVERSION_ID"; // Ask the user which LinkedIn conversion rule counts a closed deal, then look up its ID with the same connection.
export const TIKTOK_ADVERTISER_ID = "REPLACE_TIKTOK_ADVERTISER_ID"; // Ask the user for their TikTok advertiser ID; it is shown in TikTok Ads Manager.
export const TIKTOK_CRM_EVENT_SET_ID = "REPLACE_TIKTOK_CRM_EVENT_SET_ID"; // Ask the user for the CRM event set ID that TikTok Events Manager created for this CRM; it is listed under the CRM events in TikTok Ads Manager.

// Value of the Salesforce opportunity stage that counts as a won deal.
export const CLOSED_WON_STAGE = "Closed Won";
// Name the conversion carries on every platform.
export const CLOSED_WON_EVENT_NAME = "Closed Won";
