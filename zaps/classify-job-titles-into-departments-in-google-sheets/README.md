# Classify job titles into departments, and update Google Sheets

Each new job title added to your Google Sheet is classified into a department by ChatGPT, and the department is written into the same row.

**Apps:** Google Sheets, ChatGPT

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/classify-job-titles-into-departments-in-google-sheets

The agent follows `SKILL.md`: it asks you for your job title sheet and tab, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-sheets`, `chatgpt`)
- `triggers/`: what starts it
