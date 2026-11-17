---
name: log-new-stripe-payments-to-google-sheets
description: Build a Zap on Zapier that adds a row to a Google Sheets tracker for every completed Stripe payment, with its ID, amount, currency, status, customer email and description. Use when a team wants a running record of Stripe payments in a sheet to track and reconcile transactions without copying them by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every completed Stripe payment gets a row in your tracking sheet with its amount, status and customer, so your payment records stay current for reconciliation."
  apps: "Stripe, Google Sheets"
  category: "Finance"
  job: "Financial reporting"
  source: "https://zapier.com/templates/details/8dde897ab70987cac6c217f638572752671df69494a696408e2ad088dc68a4bb"
---

# Log new Stripe payments in Google Sheets for tracking

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-new-stripe-payments-to-google-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new payment is completed in Stripe (`stripe`, `new_payment`).
2. **Google Sheets** adds one row to the tracker worksheet with the time the payment was logged, the Stripe payment ID, when Stripe created it, the amount, the currency, the status, the customer's email and the description.

Every completed payment gets a new row. The Zap only writes to the sheet; it never changes or refunds anything in Stripe.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting          | What goes there                                                                                                                    |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `SPREADSHEET_ID` | The payments tracker: ask which sheet it is, then look up its ID (the long ID in its URL) with the user's Google Sheets connection |

Also review the defaults with them:

- `WORKSHEET_ID`: the tab holding the tracker. `"0"` is the first tab.
- `LOGGED_AT_COLUMN` through `DESCRIPTION_COLUMN`: column keys such as `COL$A`, not header names. Map the user's headers to their column letters, or leave a column out by pointing it at an empty column they don't use.
- `AMOUNT_COLUMN` holds Stripe's amount in its smallest currency unit (cents for USD), not dollars. Keep the column header that says so, or divide the amount in the workflow before writing if the user wants major units.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `stripe` to the user's Stripe connection for the account whose payments should be logged, and `google-sheets` to the connection for the account that owns the tracking sheet.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-payment.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_payment`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Stripe `new_payment` trigger's fields and the Google Sheets `add_row` action's fields with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using a test-mode payment the user made in Stripe's test environment, not a live one:

```json
{
  "id": "pi_test_0000000000",
  "created": 1700000000,
  "amount": 1500,
  "currency": "usd",
  "status": "succeeded",
  "description": "Test payment for the tracking sheet",
  "customer_email": "test@example.com"
}
```

Confirm that one new row appears in the tracker with the time, the payment ID, the created time, the amount in cents, the currency, the status, the customer email and the description. If run-status tools aren't available, check the result in Google Sheets directly. The user deletes the test row, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every completed payment on the connected Stripe account adds a row. Use a Stripe account that matches the sheet's purpose.
- Refunds, disputes and failed payments are not logged by this Zap. Add a second trigger zap for those if the sheet needs them.
- Google Sheets shows the logged time in the sheet's own format and time zone.
- Never commit a real spreadsheet ID, a live Stripe key or a real customer email.
