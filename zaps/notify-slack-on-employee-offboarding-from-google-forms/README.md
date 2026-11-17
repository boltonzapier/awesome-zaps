# Employee offboarding

One resignation or termination form submission looks up the employee in BambooHR, logs the separation in a Zapier Table, and posts the right offboarding notice to payroll, IT, accounting, total rewards and tax in Slack.

**Apps:** Google Forms, BambooHR, Zapier Tables, Slack

**Based on:** [Employee offboarding](https://zapier.com/templates/details/employee-offboarding) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/notify-slack-on-employee-offboarding-from-google-forms

The agent follows `SKILL.md`: it asks you for your offboarding form, terminations table and Slack channels, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `lib/tenure.ts`: tenure in years from hire date to last day
- `lib/notifications.ts`: the voluntary and involuntary notices for each team
- `connections/`: the accounts it uses (`google-forms`, `bamboohr`, `zapier-tables`, `slack`)
- `triggers/`: what starts it
