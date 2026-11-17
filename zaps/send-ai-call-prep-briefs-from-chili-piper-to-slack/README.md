# Automatic call prep

Every meeting booked through Chili Piper gets an AI prep brief from HubSpot and Clearbit data, saved to HubSpot and your table, and sent to Slack the day before the call.

**Apps:** Chili Piper, HubSpot, Clearbit, ChatGPT, Zapier Tables, Slack

**Based on:** [Automatic call prep](https://zapier.com/templates/details/call-prep-guide) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/send-ai-call-prep-briefs-from-chili-piper-to-slack

The agent follows `SKILL.md`: it asks you for your briefs table, its columns, your HubSpot account and the Slack user who gets the brief, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`chili-piper`, `hubspot`, `clearbit`, `chatgpt`, `zapier-tables`, `slack`)
- `triggers/`: what starts it
