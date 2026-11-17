---
name: post-monthly-erg-slack-engagement-insights-from-zapier-tables
description: Build a Zap on Zapier that, on the first of each month, counts last month's Slack messages and reactions per member from a Zapier Table, writes AI insights from those counts, and posts the report to a leadership Slack channel. Use when an employee resource group wants a monthly engagement report without counting by hand.
license: MIT
metadata:
  author: zapier
  summary: "On the first of each month, last month's ERG Slack activity is counted per member from your Zapier Table, summarized with AI, and posted to your leadership channel."
  apps: "AI by Zapier, Schedule, Slack, Zapier Tables"
  category: "Data & Analytics"
  job: "Reporting management"
  source: "https://zapier.com/templates/details/employee-resource-group-slack-engagement-tracker"
---

# Employee Resource Group (ERG) Slack Engagement Tracker & Monthly Insights Report

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/post-monthly-erg-slack-engagement-insights-from-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** on the 1st of every month at 9:00 AM (`schedule`, `everyMonth`).
2. **Zapier Tables** reads every row of the engagement table and keeps the rows dated in the previous calendar month. Each row is one Slack message or reaction, with its date, type and member name.
3. **Workflow** counts messages and reactions per member and in total. If the month has no rows, the Zap stops and posts nothing.
4. **AI by Zapier** writes three to five bullet points from those counts: what the month shows, who led, and one suggestion.
5. **Slack** posts the heading, the insights and the per-member counts to the leadership channel.

The Zap only reads the table and posts to Slack. It doesn't change the table or any Slack message.

This Zap needs an engagement table filled with one row per Slack message or reaction in the ERG channel. Build that logging step as its own Zap, then point `ENGAGEMENT_TABLE_ID` at the table it writes.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                 | Where       | What goes there                                                                                                                      |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `ENGAGEMENT_TABLE_ID`   | `config.ts` | The Zapier Table holding the ERG engagement log: ask which table it is, then look up its ID with the user's Zapier Tables connection |
| `LEADERSHIP_CHANNEL_ID` | `config.ts` | The Slack channel that gets the monthly report: look up its ID (C…) with the user's Slack connection                                 |

Also review the defaults with them:

- `EVENT_DATE_FIELD`, `EVENT_TYPE_FIELD`, `MEMBER_NAME_FIELD`: the column keys (`f1`, `f2`, `f3`) for the date, the type and the member name. Map them to the user's columns. The date column must hold `YYYY-MM-DD`.
- `MESSAGE_TYPE` and `REACTION_TYPE`: the exact values the logging step writes into the type column.
- `REPORT_TITLE`: the heading of the Slack post.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection for the table, `slack` to the connection for the workspace with the leadership channel, and `ai` to the AI by Zapier connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/every-month.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `everyMonth`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Zapier Tables `find_records` action, the AI `get_completion` action and the Slack `channel_message` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match. Confirm the table's column keys match `config.ts`.

## Test it

Run this as a draft test (`run_workflow_draft` in Zapier MCP) with an empty input. The schedule trigger sends no data; the Zap reads the table itself. Use a test table or a copy of the engagement table, and have it hold a few rows dated in the previous month. The test posts to a leadership test channel the user owns, not the real one.

Confirm that one message appears in the test channel with the heading, the insights and the per-member counts, and that the counts match the rows in the table. If run-status tools aren't available, check the message in Slack directly. The user deletes the test message, not the agent.

## Notes

- Scheduled runs use UTC for the calendar month, so a report on the 1st covers the full previous month in UTC.
- The counts come from the table, not from Slack. A row missing from the table is missing from the report.
- The AI writes only from the counts it is given, and the prompt asks it not to name anyone the table doesn't list.
- Never commit a real table ID, channel ID or member name.
