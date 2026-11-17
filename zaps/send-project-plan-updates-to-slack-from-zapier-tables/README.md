# Simple Project Plan Template

Click Send Update on a project in a Zapier Table and the team gets its status, owner and dates in Slack, with the time it was sent saved back to the row.

**Apps:** Slack, Zapier Tables

**Based on:** [Simple Project Plan Template](https://zapier.com/templates/details/simple-project-plan) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/send-project-plan-updates-to-slack-from-zapier-tables

The agent follows `SKILL.md`: it asks you for your project plan table, its columns and your update channel, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`zapier-tables`, `slack`)
- `triggers/`: what starts it
