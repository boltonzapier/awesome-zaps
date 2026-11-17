---
name: email-daily-sales-report-from-zapier-tables
description: Build a Zap on Zapier that emails a daily sales summary from a Zapier Tables record when someone clicks its Send button, with the date, product, quantity sold, revenue and customer feedback. Use when a team logs each day's sales in a Zapier Table and wants to send the day's report to a manager or the team by clicking a button on the record.
license: MIT
metadata:
  author: zapier
  summary: "Click the Send button on a day's sales record and the summary is emailed to your team, so reports go out without copying numbers by hand."
  apps: "Zapier Tables, Email by Zapier"
  category: "Sales"
  job: "Sales reporting"
  source: "https://zapier.com/templates/details/daily-sales-report"
---

# Daily Sales Report Template

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/email-daily-sales-report-from-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** someone clicks the button on a record in the sales table (`zapier-tables`, `button_click_record`). The trigger brings that record's fields.
2. **Email by Zapier** sends the report to the address in `REPORT_EMAIL`: the record's date, product name, quantity sold, sales revenue and customer feedback, under the subject "Daily Sales Report".

The Zap sends one email per click and changes nothing in the table.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve table and field names to keys with the user's own Zapier Tables connection; don't ask them to paste an ID or key you can look up.

| Setting                                                                                                                                                                 | Where                                         | What goes there                                                                                                              |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `REPLACE_TABLE_ID`                                                                                                                                                      | `triggers/button-click-record.ts`, `table_id` | The sales table the records are in: ask which table it is, then look up its ID with the user's Zapier Tables connection      |
| `REPLACE_REPORT_EMAIL`                                                                                                                                                  | `config.ts`, `REPORT_EMAIL`                   | The address that receives the report                                                                                         |
| `REPLACE_DATE_FIELD_KEY`, `REPLACE_PRODUCT_NAME_FIELD_KEY`, `REPLACE_QUANTITY_SOLD_FIELD_KEY`, `REPLACE_SALES_REVENUE_FIELD_KEY`, `REPLACE_CUSTOMER_FEEDBACK_FIELD_KEY` | `config.ts`                                   | The key of each field in that table: Date, Product Name, Quantity Sold, Sales Revenue and Customer Feedback, matched by name |

Confirm the button field is the one the table's "Send Report" button lives on before turning the Zap on.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Trigger:** `zapier-tables`, `button_click_record`, bound to the `zapier-tables` account (`triggers/button-click-record.ts`). Set `table_id` from the answer above.
2. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection, for the account that owns the sales table. Bind `email` to the user's Email by Zapier connection (`connections/email.ts`). Both are set in the trigger file and `workflow.ts`.
3. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer.
4. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create and publish the workflow.
5. **Fields:** inspect the trigger's record fields and the Email by Zapier action's fields (`outbound`) with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match the trigger's output.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with the email set to the user's own address:

```json
{
  "Date": "11/16/26",
  "Product Name": "[install-test] Starter plan",
  "Quantity Sold": 3,
  "Sales Revenue": 297,
  "Customer Feedback": "[install-test] Asked about annual billing"
}
```

Check that one email arrives at the report address with the values above in the body. Then publish, click Send on a test record, and confirm the email. Ask the user to delete the test records.

## Notes

- Add a row to the email body for another table field, such as a region or a seller, by adding its key to `config.ts` and a line in `workflow.ts`.
- To send to several people, put a comma-separated list in `REPORT_EMAIL` (up to five addresses).
- To post the same summary to a chat channel as well, add a Slack step after the email.
- The Email by Zapier action sends from a zapiermail.com address and is limited to 10 emails per hour on paid Zapier plans.
- The email has the report text only; there is no attachment.
- Never commit a real email address or table ID.
