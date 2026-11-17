# Create a new Notion database entry for each new Google Calendar event

Every new Google Calendar event gets an entry in a Notion database with its name, location, status and date, so bookings and appointments stay tracked in one place.

**Apps:** Google Calendar, Notion

**Based on:** [Create a new Notion database entry for each new Google Calendar event](https://zapier.com/templates/details/eb731bb02a8d022ef5b4dcd1902987cdb1d8b805b42d2fd49faf25a260bb34b0) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/create-notion-database-entries-from-google-calendar-events

The agent follows `SKILL.md`: it asks you for your calendar and your Notion database, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-calendar`, `notion`)
- `triggers/`: what starts it
