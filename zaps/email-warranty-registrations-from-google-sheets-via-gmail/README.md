# Notify customers via email when they register for warranty in Google Sheets and Gmail

When a warranty registration is added or updated in your Google Sheets tracker, the customer gets a Gmail confirmation with a discount offer for their next order.

**Apps:** Google Sheets, Gmail

**Based on:** [Notify customers via email when they register for warranty in Google Sheets and Gmail](https://zapier.com/templates/details/4ff5279d124c761565ad9af9741a1309e62740bd7cdba7e73c4191ffd51ebcfb) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/email-warranty-registrations-from-google-sheets-via-gmail

The agent follows `SKILL.md`: it asks you for your registration sheet, its column headers and your discount code, then builds the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-sheets`, `gmail`)
- `triggers/`: what starts it
