# AI-powered hiring material

Each new hiring row gets AI-drafted job description and interview material in a Google Doc, plus a Slack channel for the hiring team, with both links saved back to the table.

**Apps:** Zapier Tables, AI by Zapier, Google Docs, Slack

**Based on:** [AI-powered hiring material](https://zapier.com/templates/details/ai-powered-hiring-material) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/draft-ai-hiring-material-in-google-docs-and-slack

The agent follows `SKILL.md`: it asks you for your hiring materials table, your doc template and the columns it writes to, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `lib/channel-name.ts`: builds the Slack channel name from the role title and half-year
- `connections/`: the accounts it uses (`zapier-tables`, `google-docs`, `slack`)
- `triggers/`: what starts it
