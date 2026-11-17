---
name: send-project-plan-updates-to-slack-from-zapier-tables
description: Build a Zap on Zapier that posts a project's status, owner and dates to a Slack channel when its Send Update button is clicked in a Zapier Tables project plan, then saves the time it was sent back to that record. Use when a team tracks projects in one Zapier table and wants a one-click status update in Slack.
license: MIT
metadata:
  author: zapier
  summary: "Click Send Update on a project in your Zapier table and the team gets its status, owner and dates in Slack, with the time it was sent saved back to the row."
  apps: "Slack, Zapier Tables"
  category: "Product"
  job: "Task management"
  source: "https://zapier.com/templates/details/simple-project-plan"
---

# Simple Project Plan Template

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/send-project-plan-updates-to-slack-from-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a Send Update button is clicked on a record in the project plan table (`zapier-tables`, `button_click_record`).
2. **Slack** posts a message to the update channel with the record's project name, owner, status, category, notes and start and end dates, and a link to the record in Zapier Tables.
3. **Zapier Tables** writes the current date and time into the record's last-update-sent column, so the table shows when each project was last reported.

The Zap only reads the one record that was clicked and writes to its last-update-sent column. It never changes the other columns.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs and field keys with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                                                                                                            | Where                                                       | What goes there                                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `TABLE_ID`                                                                                                         | `config.ts`, and `table_id` in `triggers/button-clicked.ts` | The project plan table: look up its ID with the user's Zapier Tables connection                                                  |
| `field_data_key`                                                                                                   | `triggers/button-clicked.ts`                                | The Send Update button column: look up its field key with the same connection                                                    |
| `SLACK_CHANNEL_ID`                                                                                                 | `config.ts`                                                 | The channel that receives the updates: look up its ID (C…) with the user's Slack connection                                      |
| `NAME_FIELD`, `OWNER_FIELD`, `STATUS_FIELD`, `CATEGORY_FIELD`, `START_DATE_FIELD`, `END_DATE_FIELD`, `NOTES_FIELD` | `config.ts`                                                 | The columns the message shows: look up each field key with the same Zapier Tables connection, after asking which column is which |
| `LAST_UPDATE_SENT_FIELD`                                                                                           | `config.ts`                                                 | A date-and-time column for when an update was sent: look up its field key with the same connection                               |

Use the same table ID in `config.ts` and the trigger, or the button and the write will point at different tables.

The table needs a Send Update button column and the columns above. If the user doesn't have them yet, ask them to add these columns to the table before building.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection for the table that holds the project plan, and `slack` to the user's Slack connection for the workspace with the update channel.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/button-clicked.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `button_click_record`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields and the Zapier Tables `update_record` action with the user's connection before the first test run, and fix any key in `workflow.ts` or `config.ts` that doesn't match. Inspect the Slack `channel_message` action too.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a test record the user created for this, in a test channel the user owns. Use the field keys from `config.ts` in place of the placeholders:

```json
{
  "record_id": "1234",
  "<NAME_FIELD key>": "Test project [install-test]",
  "<OWNER_FIELD key>": "Test Owner",
  "<STATUS_FIELD key>": "On track",
  "<CATEGORY_FIELD key>": "Planning",
  "<START_DATE_FIELD key>": "2026-01-05",
  "<END_DATE_FIELD key>": "2026-02-27",
  "<NOTES_FIELD key>": "Sample notes for the test."
}
```

Confirm that one Slack message appears in the test channel with the project name, owner, status, category, notes and dates, and a View in Tables link, and that the test record's last-update-sent column now has a time. The user deletes the test record and its message, not the agent.

## Notes

- Each click on Send Update posts a new message. To stop a second click from posting again, turn on the button's disable-after-click option in Zapier Tables.
- The `add_edit_link` option adds a link to this Zap at the end of each Slack message. Set it to `no` in `workflow.ts` if the team shouldn't see it.
- Never commit a real Slack channel ID, table ID or field key from the user's own table.
