// This zap's settings. Each "REPLACE_…" value is set per person before deploying; its comment says how to get it.
// The other values are defaults you can change.

// Button fields on the approval table (the template's "Approve" and "Reject" columns). The trigger reports which button was clicked by its field key.
export const APPROVE_BUTTON_KEY = "data__f4";
export const REJECT_BUTTON_KEY = "data__f5";

// Message sent to the requester when their request is approved.
export const APPROVED_MESSAGE = "Your request has been approved!";
// Message sent to the requester when their request is rejected.
export const REJECTED_MESSAGE = "Your request has been rejected.";
