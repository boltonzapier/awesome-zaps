# Expenses Tracker Template

When someone clicks the Send email button on an expense row in a Zapier Table, the row moves to Pending and the finance team gets the expense by email for reimbursement.

**Apps:** Zapier Tables, Email by Zapier

**Based on:** [Expenses Tracker Template](https://zapier.com/templates/details/expenses-tracker) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/email-expense-report-from-zapier-tables

The agent follows `SKILL.md`: it asks you for your expenses table and the finance team's address, then builds the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`zapier-tables`, `email`)
- `triggers/`: what starts it
