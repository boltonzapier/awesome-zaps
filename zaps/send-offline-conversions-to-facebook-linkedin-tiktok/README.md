# Automate offline conversion tracking across platforms

When a Salesforce deal closes won, its contact is sent to Facebook, LinkedIn and TikTok as an offline conversion, so your ad platforms learn from real revenue.

**Apps:** Salesforce, Facebook Conversions, LinkedIn Conversions, TikTok Conversions

**Based on:** [Automate offline conversion tracking across platforms](https://zapier.com/templates/details/offline-conversion-tracking-automation-facebook-tiktok-linkedin) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/send-offline-conversions-to-facebook-linkedin-tiktok

The agent follows `SKILL.md`: it asks you for your ad accounts and pixel, then builds the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`salesforce`, `facebook-conversions`, `linkedin-conversions`, `tiktok-conversion`)
- `triggers/`: what starts it
