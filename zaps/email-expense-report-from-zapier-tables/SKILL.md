---
name: email-expense-report-from-zapier-tables
description: Build a Zap on Zapier that, when someone clicks the Send email button on an expense record in a Zapier Table, sets the record's status to Pending and emails the expense details to the finance team for reimbursement. Use when employees log business expenses in a Zapier Table and submit each one for reimbursement from its own row.
license: MIT
metadata:
  author: zapier
  summary: "Click the Send email button on an expense row and the finance team gets the details by email while the row moves to Pending."
  apps: "Zapier Tables, Email by Zapier"
  category: "Finance"
  job: "Accounts payable"
  source: "https://zapier.com/templates/details/expenses-tracker"
---

# Expenses Tracker Template

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/email-expense-report-from-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** someone clicks the "Send email" button on a record in the expenses table (`zapier-tables`, `button_click_record`). The trigger brings that record's ID and fields.
2. **Zapier Tables** sets the record's Status to `Pending`.
3. **Email by Zapier** sends the finance team the expense's description, category, amount and date, under the subject "New Expense Submitted".

Each click updates one record and sends one email. The Zap changes nothing else in the table.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve the table to its ID with the user's own Zapier Tables connection; don't ask them to paste an ID you can look up.

| Setting         | Where                                                            | What goes there                                                                                                                          |
| --------------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `TABLE_ID`      | `config.ts`, and `table_id` in `triggers/button-click-record.ts` | The expenses table: ask which table it is, then look up its ID with the user's Zapier Tables connection. Use the same ID in both places. |
| `FINANCE_EMAIL` | `config.ts`                                                      | The address that receives reimbursement emails, usually the finance team's shared inbox                                                  |

Also confirm the table has the template's columns, in this order: Description, Category, Amount, Status, Date, and a "Send email" button. The field keys in `config.ts` (`f1`–`f5`, and the button at `data__f6`) match the template's table; if the user built their own table, look up each key with their Zapier Tables connection instead.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Trigger:** `zapier-tables`, `button_click_record`, bound to the `zapier-tables` account (`triggers/button-click-record.ts`). Set `table_id` from the answer above.
2. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection for the account that owns the expenses table, and `email` to the user's Email by Zapier connection (`connections/email.ts`).
3. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer.
4. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create and publish the workflow.
5. **Fields:** inspect the trigger's record fields and the Tables `update_record` action, and the Email by Zapier `outbound` action, with the user's connections before the first test run. Fix any key in `workflow.ts` or `config.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a test row the user created for this, with the finance address set to the user's own email:

```json
{
  "record_id": "rec_install_test_1",
  "new": {
    "data": {
      "f1": "[install-test] Client lunch",
      "f2": "Meals & Entertainment",
      "f3": 42.5,
      "f4": "New",
      "f5": "2026-11-16T00:00:00Z"
    }
  }
}
```

Check that the test row's Status now reads Pending and that one email arrives at the finance address with the values above in its body. The user deletes the test row, not the agent.

## Notes

- The template's second Zap, which only set the status to Pending, is merged into this one: both run from the same button, so one workflow with one trigger does both.
- The email's Status line always says Pending, because the Zap sets that status before it sends.
- To send to several people, put a comma-separated list in `FINANCE_EMAIL`.
- The Email by Zapier action sends from a zapiermail.com address and is limited to 10 emails per hour on paid Zapier plans.
- Never commit a real email address or table ID.
