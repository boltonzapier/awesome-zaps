# Lead Scoring Template

Each new lead in a Zapier Tables table gets a score, a grade, and company details from its email address, so your sales team knows who to call first.

**Apps:** Zapier Tables, Lead Score by Zapier, Formatter by Zapier

**Based on:** [Lead Scoring Template](https://zapier.com/templates/details/lead-scoring) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/score-leads-in-zapier-tables-with-company-data

The agent follows `SKILL.md`: it asks you for your lead table and its columns, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`zapier-tables`)
- `triggers/`: what starts it
