# Automated Lead Capture and Follow-Up

Each new Google Forms lead is logged to a Google Sheets CRM, gets a personalized welcome email with a booking link, and triggers a follow-up reminder on Google Calendar and a sales alert by Gmail.

**Apps:** Google Forms, Google Sheets, Gmail, Google Calendar

**Based on:** [Automated Lead Capture and Follow-Up](https://zapier.com/templates/details/automated-lead-capture-and-follow-up-74fdf7) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/automate-lead-capture-from-google-forms-to-google-sheets

The agent follows `SKILL.md`: it asks you for your lead form, CRM sheet, booking link and sales contact, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-forms`, `google-sheets`, `gmail`, `google-calendar`)
- `triggers/`: what starts it
