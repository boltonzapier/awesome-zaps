---
name: log-new-gmail-emails-to-google-sheets
description: Build a Zap on Zapier that adds a row to a Google Sheets tracker for every new Gmail email matching a search, with the time it was logged, the sender, the subject and a preview. Use when a team wants a running log of incoming emails in a sheet for tracking, reporting or analysis without copying them by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every new email that matches your Gmail search gets a row in your tracking sheet with its sender, subject and preview, so the log builds itself for reporting."
  apps: "Gmail, Google Sheets"
  category: "Data & Analytics"
  job: "Data operations"
  source: "https://zapier.com/templates/details/5bdaa4e20cb9c7d754926689bcf97b4eaa7fe773c7e2213c23775d1d1ca785e5"
---

# Log new Gmail emails into Google Sheets for tracking and analysis

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-new-gmail-emails-to-google-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new email matches the Gmail search you set (`gmail`, `search`).
2. **Google Sheets** adds one row to the tracker worksheet with the time the email was logged, its Gmail message ID, the sender's name and email, the subject, and Gmail's preview text.

Every matching email gets a new row. The Zap only writes to the sheet; it never changes or deletes emails.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting           | What goes there                                                                                                                                   |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `query` (trigger) | The Gmail search that picks which emails are logged, in Gmail search syntax, for example `in:inbox` or `from:orders@example.com subject:invoice`. |
| `SPREADSHEET_ID`  | The tracking sheet: ask which sheet it is, then look up its ID (the long ID in its URL) with the user's Google Sheets connection                  |

Also review the defaults with them:

- `WORKSHEET_ID`: the tab holding the tracker. `"0"` is the first tab.
- `LOGGED_AT_COLUMN`, `MESSAGE_ID_COLUMN`, `SENDER_NAME_COLUMN`, `SENDER_EMAIL_COLUMN`, `SUBJECT_COLUMN`, `SNIPPET_COLUMN`: column keys such as `COL$A`, not header names. Map the user's headers to their column letters, or leave a column out by pointing it at an empty column they don't use.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `gmail` to the user's Gmail connection for the mailbox to log, and `google-sheets` to the connection for the account that owns the tracking sheet.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/search.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `search`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields and the `add_row` action's fields with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using a test email the user sent to themselves for this, not a real one:

```json
{
  "message_id": "18c0example",
  "subject": "Test email for the tracking sheet",
  "snippet": "This is a test email for the tracking sheet.",
  "from": { "name": "Test Sender", "email": "test@example.com" }
}
```

Confirm that one new row appears in the tracker with the time, the message ID, the sender, the subject and the preview. If run-status tools aren't available, check the result in Google Sheets directly. The user deletes the test row, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every email matching the query adds a row. Keep the query narrow enough that the sheet stays useful.
- Google Sheets shows the logged time in the sheet's own format and time zone.
- Never commit a real spreadsheet ID or a real Gmail search that names a private person.
