# Capture incoming data from webhooks and log it into Google Sheets

Every request sent to your Zapier webhook URL adds a row to a Google Sheets sheet with the time it arrived and its data, so incoming data is logged for tracking and further processing.

**Apps:** Webhooks by Zapier, Google Sheets

**Based on:** [Capture incoming data from webhooks and log it into Google Sheets](https://zapier.com/templates/details/357d1d71f006c8418cebb45dd8ca85baf279aa63bd91924f111f661a42366c37) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-incoming-webhook-data-to-google-sheets

The agent follows `SKILL.md`: it asks you for your tracking sheet, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the account it uses (`google-sheets`)
- `triggers/`: what starts it (`hook_v2`, a Catch Hook on Webhooks by Zapier)
