---
name: send-slack-dm-for-zapier-tables-approval-decisions
description: Build a Zap on Zapier that sends the requester a Slack direct message when someone clicks Approve or Reject on a request in a Zapier Table. Use when a team manages approval requests in one table and wants the people who asked told the outcome in Slack without writing each message by hand.
license: MIT
metadata:
  author: zapier
  summary: "When you click Approve or Reject on a request in your approval table, the requester gets a Slack message with the decision."
  apps: "Slack, Zapier Tables"
  category: "Business Owners"
  job: "Team communication"
  source: "https://zapier.com/templates/details/approval-request"
---

# Approval Request Template

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/send-slack-dm-for-zapier-tables-approval-decisions. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** someone clicks a button on a record in the approval table (`zapier-tables`, `button_click_record`).
2. **Workflow** checks which button was clicked. Approve sends "Your request has been approved!"; Reject sends "Your request has been rejected." Any other button is ignored.
3. **Slack** looks up the requester by the Slack username typed on the record, then sends them a direct message with the decision.

The Zap doesn't change the record. Each click sends one message.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting    | Where                             | What goes there                                                                                                                                             |
| ---------- | --------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `table_id` | `triggers/button-click-record.ts` | The approval table, with Name, Details of Request, Slack Username, and Approve and Reject buttons. Look up its ID with the user's Zapier Tables connection. |

The table needs these fields in this order: `Name` (text), `Details of Request` (long text), `Slack Username` (text), `Approve` (button), `Reject` (button). The `APPROVE_BUTTON_KEY` and `REJECT_BUTTON_KEY` values in `config.ts` match the Approve and Reject button fields; change them only if the user's table uses different field keys.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection for the table, and `slack` to the user's Slack connection for the workspace where the requesters are.
2. **Source:** publish `workflow.ts` and `config.ts`. `triggers/button-click-record.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them, with `table_id` replaced by the user's answer. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `button_click_record`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's output and the Slack `user_by_username` and `direct_message` actions with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with a test record in the approval table that the user created for this:

```json
{
  "field_data_key": "data__f4",
  "new": {
    "data": {
      "f1": "Test Requester",
      "f2": "Test request details",
      "f3": "test.user"
    }
  }
}
```

Confirm that the test user receives one direct message reading "Your request has been approved!" in Slack. The user deletes the test record and its message, not the agent.

## Notes

- Clicking Approve or Reject on any record sends a message to whoever is named in its Slack Username field, so keep that column accurate before the Zap is turned on.
- The Zap sends each message as a bot. It doesn't mention people, so the message doesn't ping a channel.
- Never commit a real table ID or a real Slack username.
