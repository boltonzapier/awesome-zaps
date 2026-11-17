# Team cohesion: AI Team ReadMe creator

When someone answers a short survey about how they work, a ReadMe is drafted for them in Google Docs, written in their own voice and shared with them in Slack, and their manager is sent the link a few business days later.

**Apps:** Slack, BambooHR, Google Docs, Google Drive, Zapier Tables, AI by Zapier

**Based on:** [Team cohesion: AI Team ReadMe creator](https://zapier.com/templates/details/team-cohesion-ai-team-readme-creator) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/create-ai-team-readme-in-google-docs

The agent follows `SKILL.md`: it asks you for your survey table, your ReadMe folder and your column mapping, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `lib/business-days.ts`: adds business days to the scheduled manager message's date
- `lib/readme-prompts.ts`: the instructions for the seven AI-written ReadMe sections
- `connections/`: the accounts it uses (`bamboohr`, `slack`, `google-docs`, `google-drive`, `zapier-tables`, `ai`)
- `triggers/`: what starts it
