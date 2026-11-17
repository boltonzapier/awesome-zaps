# Capture new leads from Facebook Lead Ads, analyze with AI, and log in Google Sheets

Each new Facebook lead is logged to your Google Sheet with its details, plus the first and last name and a person-or-business flag that AI reads from the name.

**Apps:** Facebook Lead Ads, AI by Zapier, Google Sheets

**Based on:** [Capture new leads from Facebook Lead Ads, analyze with AI, and log in Google Sheets](https://zapier.com/templates/details/9e150c2e3e12f55c123272cc2b8450d4fe544e95258f17af3069c91d8ba69402) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-facebook-leads-to-google-sheets-with-ai

The agent follows `SKILL.md`: it asks you which Facebook Page starts the Zap and which Google Sheet collects the leads, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`facebook-lead-ads`, `google-sheets`)
- `triggers/`: what starts it
