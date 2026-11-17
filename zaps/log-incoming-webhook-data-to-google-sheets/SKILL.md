---
name: log-incoming-webhook-data-to-google-sheets
description: Build a Zap on Zapier that catches each request sent to a Zapier webhook URL and adds a row to a Google Sheets sheet with the time it arrived and its full JSON payload. Use when a form, service or script posts data to a webhook and the team wants a running log of it in a sheet for tracking and further processing.
license: MIT
metadata:
  author: zapier
  summary: "Every request sent to your Zapier webhook URL adds a row to your Google Sheet with the time it arrived and its data, so incoming data is logged for tracking and analysis."
  apps: "Webhooks by Zapier, Google Sheets"
  category: "Data & Analytics"
  job: "Data automation"
  source: "https://zapier.com/templates/details/357d1d71f006c8418cebb45dd8ca85baf279aa63bd91924f111f661a42366c37"
---

# Capture incoming data from webhooks and log it into Google Sheets

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-incoming-webhook-data-to-google-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a POST, PUT or GET request arrives at the Zapier webhook URL (`webhook`, `hook_v2`, "Catch Hook"). The whole request body is passed on.
2. **Google Sheets** adds one row to the sheet's first tab with the time the request was received and the payload as JSON text.

Every request adds a row. The Zap only writes to the sheet; it never changes or deletes anything else.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting          | What goes there                                                                                                                                |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------- |
| `SPREADSHEET_ID` | The sheet that receives the data: ask which sheet it is, then look up its ID (the long ID in its URL) with the user's Google Sheets connection |

Also review the defaults with them:

- `WORKSHEET_ID`: the tab that receives rows. `"0"` is the first tab. The tab's first row must hold column headers.
- `RECEIVED_AT_COLUMN` and `PAYLOAD_COLUMN`: column keys such as `COL$A`, not header names. Map them to the columns the user wants, or point one at an empty column they don't use.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-sheets` to the user's Google Sheets connection for the account that owns the sheet. The webhook trigger needs no account.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/hook.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with `webhook`, find the row whose `key` is `hook_v2`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Webhook URL:** after the trigger is set up, Zapier gives it a unique URL. Give that URL to the sender. Treat it as a secret; it is not written into this folder.
5. **Fields:** inspect the `add_row` action's fields with the user's Google Sheets connection before the first test run, and fix any column key in `config.ts` that doesn't match the sheet.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using a test request the user sends to the webhook URL for this, not real data:

```json
{
  "name": "Test Person",
  "message": "This is a test request for the webhook log."
}
```

Confirm that one new row appears in the sheet with the time and the payload text. If run-status tools aren't available, check the result in Google Sheets directly. The user deletes the test row, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every request to the webhook URL adds a row. Anyone with the URL can add rows, so share it only with the senders who need it.
- The payload is stored as JSON text in one column. Split it into separate columns later with the sheet's own formulas if the user needs them.
- Never commit a real spreadsheet ID or a real webhook URL.
