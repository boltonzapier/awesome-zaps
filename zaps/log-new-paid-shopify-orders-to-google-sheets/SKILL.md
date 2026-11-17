---
name: log-new-paid-shopify-orders-to-google-sheets
description: Build a Zap on Zapier that adds a row to a Google Sheets order log for every new paid Shopify order, with the order number, date, customer, sales channel, discount and items. Use when a store wants a running log of paid orders in a sheet for tracking and sales analysis without copying them by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every new paid Shopify order gets a row in your order log sheet, so the log builds itself for tracking and sales reporting."
  apps: "Shopify, Google Sheets"
  category: "Sales"
  job: "Sales reporting"
  source: "https://zapier.com/templates/details/0201b8c36019dfbcf8d56f7ee4f1912b80963ce2bdaca9d492312dc44c78c93e"
---

# Log new paid orders from Shopify to Google Sheets for tracking

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-new-paid-shopify-orders-to-google-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a Shopify order is paid (`shopify`, `new_paid_order_v3`).
2. **Google Sheets** adds one row to the order log worksheet with the time it was logged, the Shopify order ID and order number, the order date, the customer's name and email, the sales channel, the currency, the total discount, and the items as quantity and title.

Every paid order gets a new row. The Zap only writes to the sheet; it never changes Shopify orders.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting          | What goes there                                                                                                                   |
| ---------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `SPREADSHEET_ID` | The order log sheet: ask which sheet it is, then look up its ID (the long ID in its URL) with the user's Google Sheets connection |

Also review the defaults with them:

- `WORKSHEET_ID`: the tab holding the order log. `"0"` is the first tab.
- `LOGGED_AT_COLUMN`, `ORDER_ID_COLUMN`, `ORDER_NAME_COLUMN`, `ORDER_DATE_COLUMN`, `CUSTOMER_NAME_COLUMN`, `CUSTOMER_EMAIL_COLUMN`, `SALES_CHANNEL_COLUMN`, `CURRENCY_COLUMN`, `DISCOUNT_COLUMN`, `ITEMS_COLUMN`: column keys such as `COL$A`, not header names. Map the user's headers to their column letters, or leave a column out by pointing it at an empty column they don't use.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `shopify` to the user's Shopify connection for the store whose orders get logged, and `google-sheets` to the connection for the account that owns the order log sheet.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-paid-order.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_paid_order_v3`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields with the user's Shopify connection, and the `add_row` action's fields with the user's Google Sheets connection, before the first test run. Fix any key in `workflow.ts` that doesn't match, including the order fields it reads (`id`, `name`, `createdAt`, `email`, `sourceName`, `currencyCode`, `billingAddress.name`, `lineItems`, `totalDiscountsSet`).

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using a test order the user placed in a Shopify test store, not a real one:

```json
{
  "id": 820982911946154508,
  "name": "#TEST1001",
  "createdAt": "2026-01-01T10:00:00Z",
  "email": "test@example.com",
  "sourceName": "web",
  "currencyCode": "USD",
  "billingAddress": { "name": "Test Customer" },
  "lineItems": [{ "title": "Test product", "quantity": 1 }],
  "totalDiscountsSet": { "shopMoney": { "amount": "0.00" } }
}
```

Confirm that one new row appears in the order log with the time, the order ID, the order number, the date, the customer, the sales channel, the currency, the discount and the item. If run-status tools aren't available, check the result in Google Sheets directly. The user deletes the test row, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every paid order adds a row. Keep the sheet to one row per order so the totals stay accurate.
- Google Sheets shows the logged time in the sheet's own format and time zone.
- Shopify's `totalDiscountsSet` is a money set; the row takes its `shopMoney.amount`.
- Never commit a real spreadsheet ID or a real Shopify order.
