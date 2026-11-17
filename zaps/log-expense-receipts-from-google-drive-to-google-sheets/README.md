# Extract expense details from receipts in Google Drive, analyze with ChatGPT, and add to Google Sheets

Each receipt uploaded to a Google Drive folder is read by ChatGPT and logged as one row in a Google Sheets expense log, with its merchant, date, total, currency and category.

**Apps:** Google Drive, ChatGPT (OpenAI), Google Sheets

**Based on:** [Extract expense details from receipts in Google Drive, analyze with ChatGPT, and add to Google Sheets](https://zapier.com/templates/details/d82dcc07364e032d6c92ab49a476035a6a9f8d44931c3aac5ecae942ccf47f21) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-expense-receipts-from-google-drive-to-google-sheets

The agent follows `SKILL.md`: it asks you for your receipt folder and your expense log sheet, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-drive`, `chatgpt`, `google-sheets`)
- `triggers/`: what starts it
