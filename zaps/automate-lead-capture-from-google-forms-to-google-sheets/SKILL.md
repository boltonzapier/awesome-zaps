---
name: automate-lead-capture-from-google-forms-to-google-sheets
description: Build a Zap on Zapier that logs each new Google Forms lead into a Google Sheets CRM, sends the lead a personalized welcome email with a booking link, creates a 24-hour follow-up reminder on Google Calendar, and alerts the sales team by Gmail. Use when a team wants inbound form leads captured, answered and followed up automatically.
license: MIT
metadata:
  author: zapier
  summary: "Each new Google Forms lead lands in your CRM sheet, gets a welcome email with a booking link, and triggers a follow-up reminder and a sales alert."
  apps: "Google Forms, Google Sheets, Gmail, Google Calendar"
  category: "Sales"
  job: "Lead management"
  source: "https://zapier.com/templates/details/automated-lead-capture-and-follow-up-74fdf7"
---

# Automated Lead Capture and Follow-Up

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/automate-lead-capture-from-google-forms-to-google-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new response is submitted to the lead form (`google-forms`, `new_form_response`).
2. **Google Sheets** logs the lead to the CRM worksheet with its submission time, name, email, phone, company, lead source, status `New Lead`, score `Cold`, and a follow-up date 24 hours out.
3. **Gmail** sends the lead a personalized welcome email with a booking link.
4. **Google Calendar** creates a follow-up reminder for the team at the follow-up time.
5. **Gmail** sends the sales team member a summary of the lead.

If a submission has no name or no email, the Zap logs it to the Incomplete Leads tab and stops there, so no welcome email goes out.

If one action fails, the Zap records the error and runs the rest, so a single failure doesn't lose the lead.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                                                          | Where                           | What goes there                                                                                                             |
| ---------------------------------------------------------------- | ------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `formId`                                                         | `triggers/new-form-response.ts` | The Google Form that collects leads: look up its ID (the long ID in the form's URL) with the user's Google Forms connection |
| `SPREADSHEET_ID`                                                 | `config.ts`                     | The Google Sheet that holds the lead CRM: look up its ID (the long ID in its URL) with the user's Google Sheets connection  |
| `INCOMPLETE_WORKSHEET_ID`                                        | `config.ts`                     | The worksheet ID of an "Incomplete Leads" tab in the CRM sheet. Ask the user to add the tab first                           |
| `FORM_QUESTIONS` (`name`, `email`, `phone`, `company`, `source`) | `config.ts`                     | The exact title of the form question for each field. If the form doesn't ask for one, the column stays blank                |
| `COMPANY_INTRO`                                                  | `config.ts`                     | One or two sentences about the company, shown under the greeting in every welcome email                                     |
| `BOOKING_LINK`                                                   | `config.ts`                     | The scheduling link leads use to book a consultation or demo                                                                |
| `SALES_EMAIL`                                                    | `config.ts`                     | The sales team member who gets a new-lead alert                                                                             |
| `CALENDAR_ID`                                                    | `config.ts`                     | The calendar that holds the follow-up reminders: look up its ID with the user's Google Calendar connection                  |

Also review the defaults with them: `CRM_WORKSHEET_ID` (the first tab is `"0"`), the `COL$A`–`COL$I` column keys (map the user's headers to their column letters), `FOLLOW_UP_HOURS` and `FOLLOW_UP_MINUTES`.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-forms` to the user's Google Forms connection for the account that owns the lead form, `google-sheets` to the connection for the account that owns the CRM sheet, `gmail` to the account that sends the welcome and alert emails, and `google-calendar` to the account that holds the follow-up calendar.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-form-response.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_form_response`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields with the user's Google Forms connection, so the form question titles in `FORM_QUESTIONS` match the keys the trigger delivers. Then inspect the Google Sheets `add_row` action, the Gmail `message` action and the Google Calendar `detailed_event` action, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) with a test form the user owns, and send the welcome and alert emails only to the user's own address:

```json
{
  "Name": "Test Lead",
  "Email": "test@example.com",
  "Phone": "555-0100",
  "Company": "Example Co",
  "How did you hear about us?": "Search"
}
```

The question keys above are placeholders: replace them with the form's real question titles before the run.

Confirm that one row appears in the CRM sheet with status `New Lead`, that the welcome email and the sales alert arrived, and that the follow-up reminder is on the calendar 24 hours out. If run-status tools aren't available, check each result in its app directly. The user deletes the test row, email and calendar event, not the agent.

## Notes

- The follow-up reminder is created for every lead. The template's original "only if no booking is made" check needs a booking lookup this Zap doesn't make; the reminder is a 24-hour nudge to check the calendar.
- The welcome email is plain text with no signature or open tracking.
- Submissions with no name or no email go to the Incomplete Leads tab and get no emails.
- Never commit a real form ID, spreadsheet ID, calendar ID, booking link or email address.
