# Employee Resource Group (ERG) Slack Engagement Tracker & Monthly Insights Report

On the first of each month, last month's ERG Slack activity is counted per member from a Zapier Table, summarized with AI, and posted to your leadership channel.

**Apps:** AI by Zapier, Schedule, Slack, Zapier Tables

**Based on:** [Employee Resource Group (ERG) Slack Engagement Tracker & Monthly Insights Report](https://zapier.com/templates/details/employee-resource-group-slack-engagement-tracker) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/post-monthly-erg-slack-engagement-insights-from-zapier-tables

The agent follows `SKILL.md`: it asks you for your engagement table and your leadership channel, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`zapier-tables`, `slack`, `ai`)
- `triggers/`: what starts it
