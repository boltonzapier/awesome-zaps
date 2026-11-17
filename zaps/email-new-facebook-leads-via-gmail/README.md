# Notify team member via email when new lead is generated from Facebook Lead Ads

Each new lead from a Facebook Page lead form is emailed to your team member through Gmail, with the lead's name, email, phone and submission time, so follow-up starts right away.

**Apps:** Facebook Lead Ads, Gmail

**Based on:** [Notify team member via email when new lead is generated from Facebook Lead Ads](https://zapier.com/templates/details/c78e494572fa7972b702800cc0f82db3afe40e1614957c763439633a8e679cf2) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/email-new-facebook-leads-via-gmail

The agent follows `SKILL.md`: it asks you for your Facebook Page and the address that should get each lead, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`facebook-lead-ads`, `gmail`)
- `triggers/`: what starts it
