---
name: log-slack-changelog-reactions-to-zapier-tables
description: Build a Zap on Zapier that turns a Slack message a team member reacts to with a changelog emoji into a changelog entry in a Zapier Table, with an AI-written title and summary, and replies in the thread. Use when a team wants to record tool and process updates from Slack in one changelog without copying them by hand.
license: MIT
metadata:
  author: zapier
  summary: "A team member reacts to a Slack message with the changelog emoji, and it becomes a titled changelog entry in a Zapier Table, with the thread confirming it."
  apps: "Slack, AI by Zapier, Zapier Tables"
  category: "Product"
  job: "Product operations"
  source: "https://zapier.com/templates/details/slack-changelog-automation"
---

# Auto-capture tool & process updates from Slack in a centralized changelog

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-slack-changelog-reactions-to-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a Slack reaction with the `changelog` emoji is added to a message.
2. **Team check:** the reacting user's Slack ID must be in the team directory table. Other reactions stop here.
3. **Duplicate check:** if the message's timestamp is already in the changelog table, the Zap replies in the thread that it was already logged and stops.
4. **AI by Zapier** writes a 50-character title and a 200 to 250 character summary from the message text.
5. **Zapier Tables** adds a changelog row with the title, summary, message text, Slack link, who recorded it and who wrote the message.
6. **Slack** replies in the thread that the update was added, with a link to the changelog.

The Zap only writes to the changelog table and the thread. It never edits Slack messages or the team directory.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                                 | What goes there                                                                                                                                       |
| --------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TEAM_DIRECTORY_TABLE_ID` (`config.ts`) | The Zapier Table listing team members with their Slack user IDs. Ask which table it is, then look up its ID with the user's Zapier Tables connection. |
| `CHANGELOG_TABLE_ID` (`config.ts`)      | The Zapier Table that holds the changelog. Ask which table it is, then look up its ID with the same connection.                                       |
| `CHANGELOG_URL` (`config.ts`)           | The link to the changelog table or its interface. It appears in the Slack replies.                                                                    |

Also review the defaults with them:

- `emoji` in `triggers/new-reaction-added.ts`: `changelog`. Create a custom Slack emoji with that name, or change it to another emoji name.
- Column keys in `config.ts`, such as `TEAM_SLACK_ID_FIELD` (`f2`) and `CHANGELOG_MESSAGE_TS_FIELD` (`f3`). Each `fN` is a column in table order. Map them to the user's columns before building.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `slack` to the Slack account in the workspace where people react, `zapier-tables` to the account that owns both tables, and `ai` to AI by Zapier.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-reaction-added.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. For the trigger's `selected_api`, call `search_triggers` with the `slack` slug, find the row whose `key` is `new_reaction_added_v3`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields and the `find_record`, `create_record`, `channel_message` and `get_completion` actions with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), in a test channel the user owns, with a message the user reacts to with the changelog emoji. The user's own Slack ID must be in the team directory for the test to reach the changelog step.

```json
{
  "user": "U0EXAMPLE",
  "message": {
    "ts": "1700000000.000100",
    "raw_text": "[install-test] Added CSV export to the reports page.",
    "permalink": "https://example.slack.com/archives/C0EXAMPLE/p1700000000000100",
    "channel": { "id": "C0EXAMPLE" },
    "user": { "name": "tester", "real_name": "Test User" }
  }
}
```

Confirm that one new changelog row appears with the title, summary, message text and link, and that the thread shows the confirmation reply. Then reacting again to the same message should give the "already logged" reply and no new row. If run-status tools aren't available, check the changelog table and the Slack thread directly. The user deletes the test row and the test message, not the agent.

## Notes

- Once the Zap is published, every changelog reaction from a team member adds a row. Keep the team directory current, since a person who isn't in it is ignored.
- The duplicate check uses the Slack message timestamp, so a message reacted to twice creates one row.
- The AI title and summary are drafts. Check their length and wording in the table, and edit the row if needed.
- Never commit a real Slack ID, table ID or channel ID.
