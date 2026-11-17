# To-Do List Template

When you star an email in Gmail, it's added as a task to your to-do list Table, with its subject and body.

**Apps:** Gmail, Zapier Tables

**Based on:** [To-Do List Template](https://zapier.com/templates/details/to-do-list) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/add-starred-gmail-emails-to-to-do-list

The agent follows `SKILL.md`: it asks you which Zapier Table is your to-do list, then builds and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`gmail`, `zapier-tables`)
- `triggers/`: what starts it
