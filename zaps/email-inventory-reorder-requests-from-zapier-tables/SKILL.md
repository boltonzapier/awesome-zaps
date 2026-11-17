---
name: email-inventory-reorder-requests-from-zapier-tables
description: Build a Zap on Zapier that emails a reorder request from a Zapier Tables inventory record when someone clicks its Send request button, with the item, description, vendor and quantity requested, then clears the record's reorder fields and logs the request on it. Use when a team tracks stock in a Zapier Table and wants to reorder an item by clicking one button on its record.
license: MIT
metadata:
  author: zapier
  summary: "Click the Send request button on a low-stock record and the reorder request is emailed to your supplier, with the record updated to show it was requested."
  apps: "Zapier Tables, Email by Zapier"
  category: "Business Owners"
  job: "Procurement operations"
  source: "https://zapier.com/templates/details/inventory"
---

# Inventory Template

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/email-inventory-reorder-requests-from-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** someone clicks the Send request button on a record in the inventory table (`zapier-tables`, `button_click_record`). The trigger brings that record's fields and IDs.
2. **Email by Zapier** sends the reorder request to the address in `REORDER_EMAIL`: the item, its description, its vendor and the quantity requested, under the subject "New Reorder Request".
3. **Zapier Tables** updates the same record: Need More? is unchecked, Reorder Quantity is reset to 0, and Last Reorder Note says how many were requested.

Each click sends one email and changes only that record.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve table and field names to keys with the user's own Zapier Tables connection; don't ask them to paste an ID or key you can look up.

| Setting                                                                                                                                                                                           | Where                                               | What goes there                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `REPLACE_TABLE_ID`                                                                                                                                                                                | `triggers/button-click-record.ts`, `table_id`       | The inventory table: ask which table it is, then look up its ID with the user's Zapier Tables connection                            |
| `REPLACE_BUTTON_FIELD_KEY`                                                                                                                                                                        | `triggers/button-click-record.ts`, `field_data_key` | The field holding the Send request button, named Send Reorder Request in the template: look up its key in that table                |
| `REPLACE_REORDER_EMAIL`                                                                                                                                                                           | `config.ts`, `REORDER_EMAIL`                        | The address that receives reorder requests: the user's own address or a supplier's                                                  |
| `REPLACE_ITEM_FIELD_KEY`, `REPLACE_DESCRIPTION_FIELD_KEY`, `REPLACE_VENDOR_FIELD_KEY`, `REPLACE_REORDER_QUANTITY_FIELD_KEY`, `REPLACE_NEED_MORE_FIELD_KEY`, `REPLACE_LAST_REORDER_NOTE_FIELD_KEY` | `config.ts`                                         | The key of each field in that table: Item, Description, Vendor, Reorder Quantity, Need More? and Last Reorder Note, matched by name |

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Trigger:** `zapier-tables`, `button_click_record`, bound to the `zapier-tables` account (`triggers/button-click-record.ts`). Set `table_id` and `field_data_key` from the answers above.
2. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection, for the account that owns the inventory table. Bind `email` to the user's Email by Zapier connection (`connections/email.ts`). Both are set in the trigger file and `workflow.ts`.
3. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer.
4. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create and publish the workflow.
5. **Fields:** inspect the trigger's record fields, the Zapier Tables `update_record` action's fields and the Email by Zapier `outbound` action's fields with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match, including the `new__` prefix on record fields if the trigger delivers them without it.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with the email set to the user's own address and the table set to a test table:

```json
{
  "table_id": "<the test table's ID>",
  "record_id": "<the test record's ID>",
  "new__<Item field key>": "[install-test] Printer paper",
  "new__<Description field key>": "[install-test] A4, 80gsm, 500 sheets",
  "new__<Vendor field key>": "[install-test] Test Supplier",
  "new__<Reorder Quantity field key>": "5"
}
```

Use the field keys the user chose, with the `new__` prefix. Check that one email arrives at the reorder address with the values above in the body, then that the test record shows Need More? unchecked, Reorder Quantity 0 and the note "requested 5 more". The user deletes the test record, not the agent.

## Notes

- Each click sends one email and resets the record, so clicking twice sends two requests.
- The email has the request text only; there is no attachment and no PDF purchase order.
- The email goes from a zapiermail.com address and is limited to 10 emails per hour on paid Zapier plans.
- To send each product to its own supplier, add a Vendor email field to the table and point `REORDER_EMAIL` at it in `workflow.ts`.
- Never commit a real email address, table ID or field key.
