---
name: employee-onboarding
description: Build a Zap on Zapier that emails a notification when a new help request is added to a Zapier Table during employee onboarding, with the requester's email and urgency and a link to the table. Use when a team runs new-hire onboarding from a Zapier Table and wants each help request sent to the person who handles them.
license: MIT
metadata:
  author: zapier
  summary: "When a new help request is added to your onboarding table, you get an email with who asked and how urgent it is, plus a link to the table."
  apps: "Email by Zapier, Zapier Tables"
  category: "Human Resources (HR)"
  job: "HR operations"
  source: "https://zapier.com/templates/details/employee-onboarding"
---

# Employee onboarding help request alerts

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/employee-onboarding. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new row is added to the Get Help table in Zapier Tables (`zapier-tables`, `new_record`).
2. **Email by Zapier** (`email`, `outbound`) sends one email to the notification address. It says who submitted the request and how urgent it is, and links to the table.

The Zap only sends email. It never changes a table row.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                                                  | What goes there                                                                                               |
| -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `TABLE_ID` (also `table_id` in `triggers/new-record.ts`) | The Zapier Table that holds the Get Help requests. Look up its ID with the user's `zapier-tables` connection. |
| `NOTIFY_EMAIL`                                           | The address that gets each notification. Ask the user for their own address.                                  |

Also review the defaults with them: `EMAIL_FIELD` (`f1`) and `URGENCY_FIELD` (`f2`) are the table's first two columns, the requester's email and the urgency choice. Check them against the table's columns.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection, for the account that owns the table. The Email by Zapier step needs no connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-record.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's output fields and the Email by Zapier `outbound` action's fields with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run it once as a draft test, with a sample row added to the Get Help table by the user for this purpose:

```json
{
  "record_id": "rec_test_1",
  "new": {
    "data": {
      "f1": "new.hire@example.com",
      "f2": "ASAP"
    }
  }
}
```

Check that the notification arrives at the notification address, with the submitter and urgency filled in and the table link working. The user deletes the test row, not the agent.

## Notes

- The notification is sent to one address. To send it to several people, separate the addresses with commas (up to 5).
- Email by Zapier limits sends per hour on paid plans and per day on free plans. A busy onboarding week can hit the limit.
- The trigger fires on every new row, so anyone who can add rows to the table can trigger an email.
