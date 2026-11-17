# Log new paid orders from Shopify to Google Sheets for tracking

Every new paid Shopify order gets a row in a Google Sheets order log, with its number, date, customer, sales channel, discount and items, so the log builds itself for sales tracking and reporting.

**Apps:** Shopify, Google Sheets

**Based on:** [Log new paid orders from Shopify to Google Sheets for tracking](https://zapier.com/templates/details/0201b8c36019dfbcf8d56f7ee4f1912b80963ce2bdaca9d492312dc44c78c93e) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-new-paid-shopify-orders-to-google-sheets

The agent follows `SKILL.md`: it asks you for your order log sheet and its columns, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`shopify`, `google-sheets`)
- `triggers/`: what starts it
