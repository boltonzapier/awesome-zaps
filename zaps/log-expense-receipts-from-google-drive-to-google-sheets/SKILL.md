---
name: log-expense-receipts-from-google-drive-to-google-sheets
description: Build a Zap on Zapier that reads each new receipt image uploaded to a Google Drive folder with ChatGPT, pulls out the merchant, date, total, currency and category, and adds one row to a Google Sheets expense log with a link back to the receipt. Use when a team collects receipts in a shared Drive folder and wants the expense details logged without typing them by hand.
license: MIT
metadata:
  author: zapier
  summary: "Each new receipt in your Drive folder is read by ChatGPT and logged as one row in your expense sheet, with its merchant, date, total and a link to the file."
  apps: "Google Drive, ChatGPT (OpenAI), Google Sheets"
  category: "Finance"
  job: "Financial reporting"
  source: "https://zapier.com/templates/details/d82dcc07364e032d6c92ab49a476035a6a9f8d44931c3aac5ecae942ccf47f21"
---

# Extract expense details from receipts in Google Drive, analyze with ChatGPT, and add to Google Sheets

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-expense-receipts-from-google-drive-to-google-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new file is added to the receipt folder in Google Drive (`google-drive`, `file_in_folder_v2`).
2. **ChatGPT** reads the receipt image and describes its merchant, date, line items, tax, total and currency.
3. **ChatGPT** turns that description into the fields of one expense: merchant, receipt date, total, currency and category. Missing values stay empty.
4. **Google Sheets** adds one row to the expense log with the time it was logged, the Drive file ID and name, a link to the receipt, and the extracted fields.

The Zap only reads files and writes to the sheet; it never moves or changes a receipt.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting            | Where                           | What goes there                                                                                                                |
| ------------------ | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `folder` (trigger) | `triggers/file-in-folder-v2.ts` | The Drive folder receipts are uploaded to: ask which folder it is, then look up its ID with the user's Google Drive connection |
| `SPREADSHEET_ID`   | `config.ts`                     | The expense log: ask which sheet it is, then look up its ID (the long ID in its URL) with the user's Google Sheets connection  |

Also review the defaults with them:

- `WORKSHEET_ID`: the tab holding the log. `"0"` is the first tab.
- `MODEL_ID`: the ChatGPT model that reads the receipts. `gpt-4o` handles images.
- The `…_COLUMN` values: column keys such as `COL$A`, not header names. Map the user's headers to their column letters, or point a column at an empty column they don't use.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-drive` to the user's Google Drive connection for the account that can read the receipt folder, `chatgpt` to the user's ChatGPT (OpenAI) connection, and `google-sheets` to the connection for the account that owns the expense log.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/file-in-folder-v2.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `file_in_folder_v2`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields, the ChatGPT `analyze_image_content_with_vision` and `conversation_responses_api` actions, and the Google Sheets `add_row` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using a test receipt the user uploads to a test folder, not a real one:

```json
{
  "id": "1AbCdExampleFileId",
  "title": "test-receipt.jpg",
  "originalFilename": "test-receipt.jpg",
  "alternateLink": "https://drive.google.com/file/d/1AbCdExampleFileId/view",
  "file": "https://example.com/test-receipt.jpg"
}
```

Confirm that one new row appears in the expense log with the time, the file ID, the file name, the receipt link, and the merchant, date, total, currency and category read from the test receipt. If run-status tools aren't available, check the result in Google Sheets directly. The user deletes the test row and the test receipt, not the agent.

## Notes

- Every file added to the folder gets a row, including files that aren't receipts. Keep the folder for receipts only, or the log fills with other documents.
- The Zap logs a receipt once per file. Subfolders are ignored unless `includeSubfolders` is set to `"true"` in the trigger.
- Read the extracted amounts before relying on them for reporting. The model can misread a faded or skewed receipt.
- Never commit a real spreadsheet ID, a real Drive folder ID or a real receipt.
