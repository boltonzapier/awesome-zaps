# One-on-one meeting coach: AI-powered skill-building for managers

Every one-on-one recorded on Zoom gets a meeting summary and AI coaching feedback, logged to a table and sent to you in Slack with your feedback trend over the past two months.

**Apps:** Zoom, AI by Zapier, Zapier Tables, Slack

**Based on:** [One-on-one meeting coach: AI-powered skill-building for managers](https://zapier.com/templates/details/one-on-one-meeting-coach-and-summary) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/summarize-zoom-one-on-ones-and-coach-managers-with-ai

The agent follows `SKILL.md`: it asks you for your name as it appears in Zoom, your one-on-one title text, your feedback table and your Slack user ID, then builds and tests the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `lib/meeting-coach.ts`: pure helpers that read the transcript, work out talk/listen time and format the date
- `connections/`: the accounts it uses (`zoom`, `ai`, `zapier-tables`, `slack`)
- `triggers/`: what starts it
