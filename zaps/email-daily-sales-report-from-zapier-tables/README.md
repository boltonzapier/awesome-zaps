# Daily Sales Report Template

When someone clicks the Send button on a day's sales record in a Zapier Table, the summary is emailed to the team: date, product, quantity sold, revenue and customer feedback.

**Apps:** Zapier Tables, Email by Zapier

**Based on:** [Daily Sales Report Template](https://zapier.com/templates/details/daily-sales-report) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/email-daily-sales-report-from-zapier-tables

The agent follows `SKILL.md`: it asks you for your sales table, the report address and the table's field keys, then builds the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`zapier-tables`, `email`)
- `triggers/`: what starts it
