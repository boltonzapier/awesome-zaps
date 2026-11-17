---
name: email-warranty-registrations-from-google-sheets-via-gmail
description: Build a Zap on Zapier that emails each customer a warranty registration confirmation with a discount offer when a new or updated row appears in a Google Sheets registration sheet, sent from Gmail. Use when a business records warranty registrations in a sheet and wants every customer to get a prompt, friendly confirmation without writing each email by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every new or updated warranty registration in your sheet sends the customer a Gmail confirmation with a discount offer."
  apps: "Google Sheets, Gmail"
  category: "Customer Service & Success"
  job: "Customer support operations"
  source: "https://zapier.com/templates/details/4ff5279d124c761565ad9af9741a1309e62740bd7cdba7e73c4191ffd51ebcfb"
---

# Notify customers via email when they register for warranty in Google Sheets and Gmail

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/email-warranty-registrations-from-google-sheets-via-gmail. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new or updated row is added to the warranty registration worksheet (`google-sheets`, `updated_row_notify_hook`).
2. **Workflow** skips rows with no customer email address.
3. **Gmail** sends the customer a confirmation email, with their name, a note that their warranty registration is on file, and the discount code for their next order.

Each new or changed row sends one email. The Zap only sends email; it never edits the sheet.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                 | Where                                                                   | What goes there                                                                                                            |
| ----------------------- | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `SPREADSHEET_ID`        | `config.ts`, and `spreadsheet` in `triggers/updated-row-notify-hook.ts` | The sheet holding warranty registrations: look up its ID (the long ID in its URL) with the user's Google Sheets connection |
| `WORKSHEET_ID`          | `config.ts`, and `worksheet` in the trigger file                        | The tab with the registrations: pick it from that sheet's tabs. Worksheets must have column headers                        |
| `CUSTOMER_NAME_HEADER`  | `config.ts`                                                             | The column header holding the customer's name, exactly as written in the sheet's first row                                 |
| `CUSTOMER_EMAIL_HEADER` | `config.ts`                                                             | The column header holding the customer's email address, exactly as written in the sheet's first row                        |
| `DISCOUNT_CODE`         | `config.ts`                                                             | The discount code to offer registered customers, from the user                                                             |

Use the same spreadsheet and worksheet IDs in both places, or the trigger and the config will watch different data.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-sheets` to the user's Google Sheets connection for the account that owns the registration sheet, and `gmail` to the user's Gmail connection for the mailbox that sends the emails.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/updated-row-notify-hook.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `updated_row_notify_hook`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create the workflow.
4. **Fields:** inspect the trigger's fields and the Gmail `message` (Send Email) action's fields with the user's connections, and fix any key in `workflow.ts` that doesn't match. The column headers in `config.ts` must match the sheet's first row exactly.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), in a row the user has added for testing, with an email address the user owns:

```json
{
  "Name": "Test Customer",
  "Email": "test@example.com",
  "Product": "Sample product",
  "Purchase date": "2026-01-01"
}
```

Confirm that one email arrived in the user's mailbox with the customer's name and the discount code. The user deletes the test row and the test email, not the agent.

## Notes

- Every new or changed row sends an email, so rows that are edited again send a second email. Keep the discount code and wording in `config.ts` and `workflow.ts` up to date before the Zap is turned on.
- A row with no email address is skipped.
- Never commit a real spreadsheet ID, a real discount code or a customer's email address.
