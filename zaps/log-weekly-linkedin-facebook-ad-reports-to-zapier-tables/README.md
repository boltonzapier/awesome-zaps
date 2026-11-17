# AI Agent Marketing Campaign Tracker

Every week, your LinkedIn and Facebook ad results are added to one Zapier Tables ad report, ready for a weekly summary.

**Apps:** Schedule by Zapier, LinkedIn Ads, Facebook Lead Ads, Zapier Tables

**Based on:** [AI Agent Marketing Campaign Tracker](https://zapier.com/templates/details/ai-agent-marketing-campaign-tracker) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-weekly-linkedin-facebook-ad-reports-to-zapier-tables

The agent follows `SKILL.md`: it asks you for your LinkedIn ad account and your ad report table and its columns, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`linkedin-ads`, `facebook-lead-ads`, `zapier-tables`)
- `triggers/`: what starts it
