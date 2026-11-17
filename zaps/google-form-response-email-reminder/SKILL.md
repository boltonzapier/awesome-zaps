---
name: google-form-response-email-reminder
description: Build a Zap on Zapier that emails the respondent through Gmail when a new Google Forms response is submitted, confirming their request and reminding them of their responsibilities. Use when a team collects requests or sign-ups by Google Form and wants each person to get an automatic confirmation with the same reminder every time.
license: MIT
metadata:
  author: zapier
  summary: "When someone submits your Google Form, they get an email from Gmail confirming their request and reminding them of their responsibilities."
  apps: "Google Forms, Gmail"
  category: "Customer Service & Success"
  job: "Customer support operations"
  source: "https://zapier.com/templates/details/5d0fc691509e3ac9f0727fa45f32e46870a55aefab2184371c1a678c6cf6d513"
---

# Notify users via email when new Google Forms response is submitted and remind them of their responsibilities

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/google-form-response-email-reminder. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new Google Forms response arrives (`google-forms`, `new_form_response`). The form to watch is chosen when the trigger is configured.
2. **Gmail** sends an email to the address the respondent typed in the form, with the subject and body from `config.ts`. The body confirms the request and lists the responsibilities the respondent should keep in mind.

If the response has no usable email address, the run stops and sends nothing.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting       | What goes there                                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `EMAIL_FIELD` | The form question that collects the respondent's email address. Open a sample response in the form and copy that question's exact title. |

Also review the defaults with them:

- `EMAIL_SUBJECT` and `EMAIL_BODY`: the reminder text. The defaults are generic; replace them with the responsibilities the team wants respondents to remember.
- The form to watch, chosen when the trigger is configured.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Trigger:** `google-forms`, `new_form_response`, with the form the user picks. Connection: `google-forms`.
2. **Accounts:** bind `gmail` to the user's Gmail connection for the account that sends the reminders, and `google-forms` to the account that owns the form.
3. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-form-response.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them.
4. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
5. **Fields:** inspect the trigger's output and the Gmail Send Email action's fields with the user's connections before the first test run, and fix any key in `workflow.ts` or `config.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP). Use a test address that belongs to the connected Gmail account, not a real respondent, and replace the field key with the one from `EMAIL_FIELD`:

```json
{
  "Email address": "test-address@example.com",
  "Request": "Sample request"
}
```

Confirm that one email arrived at that address with the configured subject and body. The user deletes the test email, not the agent.

## Customize

- Add a Slack or Google Sheets step after the email to log who was sent a reminder.
- Send a second reminder later with a Schedule or Delay step if the respondent has not acted.

## Notes

- Each response sends one email. A response with no email answer sends nothing.
- Anyone who can submit the form receives the email, so keep the body free of sensitive details.
- Never commit a real form ID, email address or test address.
