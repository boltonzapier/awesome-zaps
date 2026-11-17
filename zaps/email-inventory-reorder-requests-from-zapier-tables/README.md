# Inventory Template

When a product in your Zapier Table runs low, click its Send request button: the reorder request is emailed and the record is updated to show it was requested.

**Apps:** Zapier Tables, Email by Zapier

**Based on:** [Inventory Template](https://zapier.com/templates/details/inventory) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/email-inventory-reorder-requests-from-zapier-tables

The agent follows `SKILL.md`: it asks you for your inventory table, its button and fields, and where reorder requests go, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`zapier-tables`, `email`)
- `triggers/`: what starts it
