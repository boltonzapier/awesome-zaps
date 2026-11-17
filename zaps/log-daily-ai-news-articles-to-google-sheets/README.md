# Daily AI News Tracker

Every evening, AI searches the news for yesterday's AI brands and launches and adds each article to a Google Sheets log, with a headline, link and summary.

**Apps:** AI by Zapier, Google Sheets, Schedule by Zapier

**Based on:** [Daily AI News Tracker](https://zapier.com/templates/details/daily-ai-news-tracker-c7a529) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-daily-ai-news-articles-to-google-sheets

The agent follows `SKILL.md`: it asks you for your news sheet and its columns, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `lib/article-id.ts`: a pure helper that names each row's step from its article link
- `connections/`: the accounts it uses (`google-sheets`)
- `triggers/`: what starts it
