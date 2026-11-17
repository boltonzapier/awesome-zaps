---
name: classify-job-titles-into-departments-in-google-sheets
description: Build a Zap on Zapier that reads the job title in each new row of a Google Sheets list, asks ChatGPT which department it belongs to, and writes that department back into the same row. Use when a team keeps a sheet of job titles, such as applicants, headcount or contacts, and wants each one sorted into a department without doing it by hand.
license: MIT
metadata:
  author: zapier
  summary: "Each new job title in your Google Sheet is classified into a department by ChatGPT, and the department is written into the same row."
  apps: "Google Sheets, ChatGPT"
  category: "Human Resources (HR)"
  job: "HR operations"
---

# Classify job titles into departments, and update Google Sheets

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/classify-job-titles-into-departments-in-google-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new row is added to the bottom of the sheet you set (`google-sheets`, `new_row_notify_hook`).
2. **Workflow** reads the job title from the title column. A row without a title is skipped.
3. **ChatGPT** is asked which department the title belongs to, from a fixed list: Executive, Engineering, Product, Design, Sales, Marketing, Customer Support, Finance, Human Resources, Operations, Legal, IT or Other. The reply is matched to that list; anything else becomes Other.
4. **Google Sheets** updates the same row and writes the department into the department column.

Only new rows are classified. Editing a title later does not run the Zap again.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting          | Where                                                               | What goes there                                                                                                       |
| ---------------- | ------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| `SPREADSHEET_ID` | `config.ts`, and `spreadsheet` in `triggers/new-row-notify-hook.ts` | The sheet that holds the job titles: look up its ID (the long ID in its URL) with the user's Google Sheets connection |
| `WORKSHEET_ID`   | `config.ts`, and `worksheet` in `triggers/new-row-notify-hook.ts`   | The tab that holds the job titles: look up its ID with the same connection                                            |

Use the same values in both places, or the trigger and the update will work on different sheets.

Also review the defaults with the user:

- `TITLE_COLUMN`: the column with the job title, `COL$A` for column A.
- `DEPARTMENT_COLUMN`: the column the department is written to, `COL$B` for column B. The cell should be empty in the sheet.
- `DEPARTMENTS` in `workflow.ts`: change the list if the team uses different department names. The model is told to choose from it.
- `CHATGPT_MODEL`: the model that classifies each title.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-sheets` to the user's Google Sheets connection for the account that owns the sheet, and `chatgpt` to the user's ChatGPT connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-row-notify-hook.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_row_notify_hook`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields and the `update_row` and `conversation_responses_api` actions with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), on a test row in a sheet the user owns:

```json
{
  "id": 2,
  "COL$A": "Senior Account Executive"
}
```

Confirm that the row's department column now holds one value from the list, and that no other row changed. The user clears the test row, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every new row with a title is classified and changed. Keep the sheet to the rows you want sorted.
- ChatGPT can return a department outside the list. Those rows get Other, so review them in the sheet.
- If ChatGPT returns no answer after several checks, the run stops without writing to the sheet.
- Never commit a real spreadsheet ID or worksheet ID.
