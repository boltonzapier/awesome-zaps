# Meeting Minutes Template

Click the Send Recap button on a meeting's row in Zapier Tables and its minutes go out by email, so the recap reaches the team without retyping anything.

**Apps:** Zapier Tables, Email by Zapier

**Based on:** [Meeting Minutes Template](https://zapier.com/templates/details/meeting-minutes) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/email-meeting-minutes-recap-from-zapier-tables

The agent follows `SKILL.md`: it asks you for your meeting minutes table and who gets the recap, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`zapier-tables`, `email`)
- `triggers/`: what starts it
