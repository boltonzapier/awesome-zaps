// This zap's settings. Each "REPLACE_…" value is set per person before building; its comment says how to get it.
// The other values are defaults you can change.

export const TABLE_ID = "REPLACE_TABLE_ID"; // Ask the user which table holds their leads, then look up its ID with their Zapier Tables connection. The trigger watches this table.
export const EMAIL_FIELD = "REPLACE_EMAIL_FIELD"; // Ask the user which column holds the email address to score, then look up its field key with their Zapier Tables connection.
export const COMPANY_DOMAIN_FIELD = "REPLACE_COMPANY_DOMAIN_FIELD"; // Ask the user which column receives the company's web domain, then look up its field key with their Zapier Tables connection.
export const IS_STUDENT_FIELD = "REPLACE_IS_STUDENT_FIELD"; // Ask the user which checkbox column receives whether the lead is a student, then look up its field key with their Zapier Tables connection.
export const SEGMENT_FIELD = "REPLACE_SEGMENT_FIELD"; // Ask the user which column receives the customer fit segment, then look up its field key with their Zapier Tables connection.
export const SCORE_FIELD = "REPLACE_SCORE_FIELD"; // Ask the user which number column receives the lead score, then look up its field key with their Zapier Tables connection.
export const TOP_SIGNALS_FIELD = "REPLACE_TOP_SIGNALS_FIELD"; // Ask the user which column receives the top signals behind the score, then look up its field key with their Zapier Tables connection.
export const GRADE_FIELD = "REPLACE_GRADE_FIELD"; // Ask the user which column receives the grade, then look up its field key with their Zapier Tables connection.
export const COMPANY_NAME_FIELD = "REPLACE_COMPANY_NAME_FIELD"; // Ask the user which column receives the company name, then look up its field key with their Zapier Tables connection.
export const COMPANY_STATE_FIELD = "REPLACE_COMPANY_STATE_FIELD"; // Ask the user which column receives the company's state, then look up its field key with their Zapier Tables connection.
export const COMPANY_STATE_CODE_FIELD = "REPLACE_COMPANY_STATE_CODE_FIELD"; // Ask the user which column receives the company's state code, then look up its field key with their Zapier Tables connection.
export const COMPANY_COUNTRY_FIELD = "REPLACE_COMPANY_COUNTRY_FIELD"; // Ask the user which column receives the company's country, then look up its field key with their Zapier Tables connection.
export const COMPANY_EMPLOYEES_FIELD = "REPLACE_COMPANY_EMPLOYEES_FIELD"; // Ask the user which number column receives the company's employee count, then look up its field key with their Zapier Tables connection.
export const COMPANY_INDUSTRY_FIELD = "REPLACE_COMPANY_INDUSTRY_FIELD"; // Ask the user which column receives the company's industry, then look up its field key with their Zapier Tables connection.

// The placeholder the lead scorer puts in its grade, and the star emoji the grade column shows instead.
export const GRADE_PLACEHOLDER = ":star:";
export const GRADE_STAR = "⭐️";
