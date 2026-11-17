---
name: create-notion-database-entries-from-google-calendar-events
description: Build a Zap on Zapier that creates a Notion database entry for each new Google Calendar event, carrying the event name, location, status and start date. Use when a team books rooms, spaces or appointments in Google Calendar and wants each booking tracked in a Notion database with its status.
license: MIT
metadata:
  author: zapier
  summary: "Every new Google Calendar event gets an entry in your Notion database with its name, location, status and date, so bookings stay tracked in one place."
  apps: "Google Calendar, Notion"
  category: "Personal Productivity"
  job: "Scheduling coordination"
  source: "https://zapier.com/templates/details/eb731bb02a8d022ef5b4dcd1902987cdb1d8b805b42d2fd49faf25a260bb34b0"
---

# Create a new Notion database entry for each new Google Calendar event

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/create-notion-database-entries-from-google-calendar-events. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new event is created on the calendar you set (`google-calendar`, `new_event`).
2. **Notion** creates one item in your database (`notion`, `create_database_item`). The item gets the event's name as its title, the event's start as its date, the event's location as its space requirements, and your chosen status.

The Zap only creates entries. It doesn't change the calendar event or any existing entry.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting        | Where                   | What goes there                                                                                                                                           |
| -------------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `calendarid`   | `triggers/new-event.ts` | The calendar whose new events get logged: pick it from the calendar list on the user's Google Calendar connection                                         |
| `DATA_SOURCE`  | `config.ts`             | The Notion database for the entries: look up its data source ID with the user's Notion connection. The database must be shared with that connection first |
| `STATUS_VALUE` | `config.ts`             | The option the Status property gives new entries, such as "Scheduled": check the option names on that database                                            |

Also review the property names with them. `TITLE_PROPERTY`, `DATE_PROPERTY`, `SPACE_PROPERTY` and `STATUS_PROPERTY` in `config.ts` must match the database's property names exactly, so change them if the user's database names them differently.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-calendar` to the user's Google Calendar connection for the calendar to watch, and `notion` to the user's Notion connection for the workspace with the database.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-event.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Notion `create_database_item` action's properties for the chosen database with the user's Notion connection before the first test run, and fix any property name in `config.ts` that doesn't match. Also confirm the trigger's output keys (`summary`, `location`, `start`) with `get_trigger_fields` on the user's connection.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a database the user owns for testing, not their working database:

```json
{
  "id": "test-event-0001",
  "summary": "[install-test] Room booking",
  "location": "Meeting room 2",
  "start": { "dateTime": "2026-12-01T10:00:00Z" },
  "end": { "dateTime": "2026-12-01T11:00:00Z" },
  "htmlLink": "https://www.google.com/calendar/event?eid=test"
}
```

Confirm that one entry appears in the database with the event's name, date, location and status. If run-status tools aren't available, check the entry in Notion directly. The user deletes the test entry, not the agent.

## Notes

- Every new event on the calendar creates an entry, including events that are not yet confirmed. Pick a calendar that holds only the bookings you want tracked.
- An all-day event has no start time, so its entry gets the date only.
- Never commit a real Notion data source ID or a real calendar ID.
