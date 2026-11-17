# Employee onboarding help request alerts

When a new help request is added to your onboarding table, you get an email with who asked and how urgent it is, plus a link to the table.

**Apps:** Email by Zapier, Zapier Tables

**Based on:** [Employee Onboarding Template](https://zapier.com/templates/details/employee-onboarding) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/employee-onboarding

The agent follows `SKILL.md`: it asks you for your Get Help table and the address to notify, then builds and tests the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the account it uses (`zapier-tables`)
- `triggers/`: what starts it
