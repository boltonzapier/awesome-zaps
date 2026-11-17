# Log new Stripe payments in Google Sheets for tracking

Every completed Stripe payment gets a row in a Google Sheets tracker, with its ID, amount, currency, status, customer email and description, so the record of payments builds itself for reconciliation.

**Apps:** Stripe, Google Sheets

**Based on:** [Log new Stripe payments in Google Sheets for tracking](https://zapier.com/templates/details/8dde897ab70987cac6c217f638572752671df69494a696408e2ad088dc68a4bb) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-new-stripe-payments-to-google-sheets

The agent follows `SKILL.md`: it asks you for your tracking sheet and its columns, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`stripe`, `google-sheets`)
- `triggers/`: what starts it
