---
name: post-hubspot-quote-approval-requests-to-slack
description: Build a Zap on Zapier that starts a quote approval in Slack when HubSpot posts a quote that is ready for approval. It logs the quote in a Zapier Table and posts the deal and quote links, with the concessions, to the approval channel. Use when sales quotes need sign-off from approvers and the approval should begin in Slack, not in HubSpot.
license: MIT
metadata:
  author: zapier
  summary: "When a HubSpot quote is ready for approval, it is logged in a Zapier Table and an approval request with its links and concessions is posted to Slack."
  apps: "Webhooks by Zapier, Zapier Tables, Slack"
  category: "Sales"
  job: "Sales operations"
  source: "https://zapier.com/templates/details/deal-desk-manage-hubspot-quote-approvals-slack"
---

# Deal desk: Manage HubSpot quote approvals in Slack

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/post-hubspot-quote-approval-requests-to-slack. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a request arrives at the Zap's webhook URL with a quote's details (`webhook`, `hook_v2`). HubSpot sends it when a quote is ready for approval.
2. **Workflow** skips the request if it has no `quote_id`.
3. **Zapier Tables** adds a row to the quote tracker table with the quote ID, the owner's HubSpot ID, the deal ID, the quote link and the concessions.
4. **Slack** posts an approval request to the approval channel, mentioning the approvers, with links to the HubSpot deal and quote and the concessions for review. Approvers discuss it in that message's thread.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting               | Where       | What goes there                                                                                                                |
| --------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------ |
| `QUOTE_TABLE_ID`      | `config.ts` | The Zapier Table that tracks quote approvals: look up its ID (the long ID in its URL) with the user's Zapier Tables connection |
| `APPROVAL_CHANNEL_ID` | `config.ts` | The Slack channel where approvals are posted: look up its ID (C…) with the user's Slack connection                             |
| `APPROVER_MENTIONS`   | `config.ts` | Who must approve: ask the user, then copy the mention from Slack, `<@U…>` for a person or `<!subteam^S…>` for a user group     |
| `HUBSPOT_PORTAL_ID`   | `config.ts` | The user's HubSpot account ID: the number in any HubSpot record URL, such as `app.hubspot.com/contacts/<number>/`              |

Also review the table field keys with the user. `QUOTE_ID_FIELD` (`f1`), `OWNER_ID_FIELD` (`f2`), `DEAL_ID_FIELD` (`f3`), `QUOTE_LINK_FIELD` (`f4`) and `CONCESSIONS_FIELD` (`f5`) must match the columns of the quote table, in that order or changed to match.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `slack` to the user's Slack connection for the workspace with the approval channel, and `zapier-tables` to the user's Zapier Tables connection for the account that owns the quote table. The webhook trigger needs no connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/hook.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with `webhook`, find the row whose `key` is `hook_v2`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Zapier Tables `create_record` action and the Slack `channel_message` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match. The table field keys in `config.ts` must match the user's table.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a test quote table and a test channel the user owns:

```json
{
  "quote_id": "000000001",
  "deal_id": "000000002",
  "hs_quote_owner_id": "000000003",
  "discount_percent": "10",
  "payment_terms": "Net 45"
}
```

Confirm that one row was added to the quote table with those values, and that the Slack message shows the quote and deal links and lists the two concessions. Delete the test row and test message afterwards.

## Notes

- Every key in the payload other than `quote_id`, `deal_id` and `hs_quote_owner_id` is listed as a concession, so HubSpot can send concessions under any key.
- The HubSpot links assume the standard `app.hubspot.com` URLs for quotes and deals.
- This Zap starts the approval only. It does not record who approves or rejects a quote, and it does not write the Slack thread back to the table. To track approvals, add a Slack `reaction` trigger zap that reads the thread and updates the same table.
- Approver routing by role, reminders, recall and rejection, and updates back to HubSpot are not part of this Zap.
- Never commit a real HubSpot portal ID, Slack channel ID, table ID or approver mention.
