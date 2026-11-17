---
name: to-do-list
description: Build a Zap on Zapier that adds each starred Gmail email to a Zapier Table used as a to-do list, with the subject and body as the task and "Gmail" as its channel. Use when someone tracks tasks in a Zapier Table and wants emails they star in Gmail to land there without copy-pasting.
license: MIT
metadata:
  author: zapier
  summary: "Star an email in Gmail and its subject and body are added as a task to your to-do list Table."
  apps: "Gmail, Zapier Tables"
  category: "Personal Productivity"
  job: "Email management"
  source: "https://zapier.com/templates/details/to-do-list"
---

# To-do list from starred Gmail

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/to-do-list. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** the user stars an email in Gmail (`gmail`, `star_message`). The trigger brings the email's subject and plain-text body.
2. **Zapier Tables** (`zapier-tables`) adds one record to the to-do list table: the subject and body go in the Message column, and the Channel column is set to "Gmail".

The Zap only adds records. It never edits or deletes rows, and it leaves "Mark as done" unset.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting         | What goes there                                                                                                                           |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `TASK_TABLE_ID` | The to-do list table: ask which Zapier Table it is, then look up its ID (the long ID in its URL) with the user's Zapier Tables connection |

Also review the defaults with them:

- `MESSAGE_FIELD` (`f1`) and `CHANNEL_FIELD` (`f3`): the table's column keys. The template's table has Message in the first column and Channel in the third. Map the user's columns if they differ.
- `GMAIL_CHANNEL`: the dropdown choice written for each task. `"Gmail"` unless their Channel column uses other labels.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `gmail` to the user's Gmail connection for the mailbox whose starred emails should become tasks. Bind `zapier-tables` to the user's Zapier Tables connection for the account that owns the table.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-starred-email.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Gmail trigger's output and the Zapier Tables `create_record` fields with the user's connections before the first test run. Confirm the trigger output has `subject` and `body_plain`, and that the table's columns are `f1` and `f3` (set `MESSAGE_FIELD` and `CHANNEL_FIELD` to match). Fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with a test table the user set up for this, not their real to-do list:

```json
{
  "subject": "[install-test] Renew the library card",
  "body_plain": "The card expires on Friday."
}
```

Confirm that one new row appears in the table: Message holds the subject and body, and Channel is "Gmail". If run-status tools aren't available, check the table directly. The user deletes the test row, not the agent.

## Notes

- Gmail's starred-email trigger fires for an email starred within two days of arriving.
- Starring a message only adds a row. Un-starring does not remove it.
- Never commit a real table ID.
