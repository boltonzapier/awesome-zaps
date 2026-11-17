# Brand mention and sentiment tracker: Get insight into when, and how, your brand is mentioned

Each new Google Alerts news mention of your brand is read by AI, saved as a row in a Zapier Table with its sentiment and quotes, and posted to your team in Slack.

**Apps:** RSS, Webhook, AI by Zapier, Zapier Tables, Slack

**Based on:** [Brand mention and sentiment tracker: Get insight into when, and how, your brand is mentioned](https://zapier.com/templates/details/automate-brand-monitoring-news-mentions-tracker) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/track-brand-mentions-sentiment-from-google-alerts

The agent follows `SKILL.md`: it asks you for your Google Alerts feed, your mentions table and its columns, and your alerts channel, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`slack`, `ai`, `zapier-tables`)
- `triggers/`: what starts it
