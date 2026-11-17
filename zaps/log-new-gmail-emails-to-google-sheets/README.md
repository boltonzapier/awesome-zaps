# Log new Gmail emails into Google Sheets for tracking and analysis

Every new Gmail email that matches your search gets a row in a Google Sheets tracker, with its sender, subject and preview, so the log builds itself for reporting.

**Apps:** Gmail, Google Sheets

**Based on:** [Log new Gmail emails into Google Sheets for tracking and analysis](https://zapier.com/templates/details/5bdaa4e20cb9c7d754926689bcf97b4eaa7fe773c7e2213c23775d1d1ca785e5) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-new-gmail-emails-to-google-sheets

The agent follows `SKILL.md`: it asks you for your Gmail search and your tracking sheet and its columns, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`gmail`, `google-sheets`)
- `triggers/`: what starts it
