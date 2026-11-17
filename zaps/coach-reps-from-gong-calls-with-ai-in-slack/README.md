# Gong call coach: AI-powered sales and success coaching

Every new Gong call longer than ten minutes gets scored and coached by AI, with the feedback logged to a table and sent to the rep in Slack. Calls that score low also go to the rep's manager.

**Apps:** Gong, Slack, Zapier Tables, AI by Zapier

**Based on:** [Gong call coach: AI-powered sales and success coaching](https://zapier.com/templates/details/call-coach-ai-sales-success-coaching) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/coach-reps-from-gong-calls-with-ai-in-slack

The agent follows `SKILL.md`: it asks you for your team directory table, your feedback log table and your Gong API base URL, then builds and tests the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `lib/call-coach.ts`: pure helpers for matching the rep, labelling the transcript and summing scores
- `connections/`: the accounts it uses (`gong`, `slack`, `zapier-tables`, `ai`)
- `triggers/`: what starts it
