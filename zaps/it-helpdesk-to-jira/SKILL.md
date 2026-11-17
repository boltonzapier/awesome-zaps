---
name: it-helpdesk-to-jira
description: Build a Zap on Zapier that turns each new message in an IT request channel into a Jira Software Cloud ticket, then replies in the Slack thread with the ticket key and link. Use when employees raise IT problems in a Slack channel and the IT team works them in Jira.
license: MIT
metadata:
  author: zapier
  summary: "Each new IT request in your Slack channel becomes a Jira ticket, and the thread gets the ticket key and link."
  apps: "Slack, Jira Software Cloud"
  category: "IT"
  job: "IT service management"
  source: "https://zapier.com/templates/details/it-helpdesk"
---

# IT help desk to Jira

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/it-helpdesk-to-jira. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new message is posted to the IT request channel (`slack`, `channel_message`). Bot posts are ignored.
2. **Workflow** skips replies inside an existing thread and empty messages, since those are not new requests.
3. **Jira Software Cloud** creates an issue in the IT project with the first line of the message as its summary, the full message and the reporter's name as its description, and the `it-helpdesk` label.
4. **Slack** replies in the request's thread with the new ticket key and its Jira link.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting              | Where                                                       | What goes there                                                                                |
| -------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| `SLACK_CHANNEL_ID`   | `config.ts`, and `channel` in `triggers/channel-message.ts` | The channel where IT requests are posted: look up its ID (C…) with the user's Slack connection |
| `JIRA_PROJECT_ID`    | `config.ts`                                                 | The Jira project for IT tickets: pick it from the project list on the user's Jira connection   |
| `JIRA_ISSUE_TYPE_ID` | `config.ts`                                                 | The issue type for those tickets, such as Task: pick it from the project's issue types         |

Use the same channel ID in both places, or the reply and the trigger will watch different channels.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `slack` to the user's Slack connection for the workspace with the request channel, and `jira-software-cloud` to the user's Jira Software Cloud connection for the site that holds the IT project.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/channel-message.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Jira `create_issue` action and the Slack `channel_message` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) in a test channel the user owns:

```json
{
  "ts": "1700000000.000100",
  "text": "My laptop can't reach the office VPN since this morning.",
  "user": { "name": "test.user", "real_name": "Test User" }
}
```

Confirm that one Jira issue was created in the IT project with the summary and description, and that the thread reply shows its key and link. The user closes or deletes the test issue, not the agent.

## Notes

- Every top-level message in the channel opens a ticket. To open tickets only for messages with a reaction, change the trigger to Slack's `new_reaction_added_v3` event.
- The summary is the first line of the message, cut to `SUMMARY_LENGTH` characters.
- To set Jira priority from the message, add a step before the create. To post each new ticket to a second channel for the IT team, add a Slack step after the reply. To mark the request closed in the thread when the ticket is Done, add a Jira `issue_updated` trigger zap.
- Never commit a real Slack channel ID or Jira project ID.
