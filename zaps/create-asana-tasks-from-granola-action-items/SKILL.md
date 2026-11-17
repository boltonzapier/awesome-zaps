---
name: create-asana-tasks-from-granola-action-items
description: Build a Zap on Zapier that reads each new Granola meeting note, uses AI to extract the action items that belong to you, and creates an Asana task for each one with its priority, due date and the meeting it came from. Use when meeting follow-ups get lost in notes and each action item should land in Asana as soon as the meeting ends.
license: MIT
metadata:
  author: zapier
  summary: "Every action item from your Granola meeting notes becomes an Asana task with its priority, due date and source, as soon as the note is saved."
  apps: "Granola, AI by Zapier, Asana"
  category: "Personal Productivity"
  job: "Meeting management"
  source: "https://zapier.com/templates/details/turn-granola-notes-into-tasks"
---

# Track your action items from Granola notes by creating Asana tasks

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/create-asana-tasks-from-granola-action-items. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new note is added to a chosen Granola folder (`granola`, `new_meeting`).
2. **AI by Zapier** reads the note's my-notes, enhanced notes and transcript and returns a list of action items, each with a title, due date, priority (P1 to P4) and the excerpt that prompted it.
3. **Workflow** stops if the note is empty or no action items were found.
4. **Asana** creates one task per action item in the chosen project, with the due date, the priority and the excerpt in its description, and the meeting title and time as its source.

Only Asana tasks are created. The Zap never edits or deletes Granola notes.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting              | Where                     | What goes there                                                                                                   |
| -------------------- | ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `selected_workspace` | `triggers/new-meeting.ts` | The Granola workspace that holds the meetings: choose it from the workspace list on the user's Granola connection |
| `document_list_id`   | `triggers/new-meeting.ts` | The Granola folder whose new notes start the Zap: choose it from the folder list                                  |
| `ASANA_WORKSPACE_ID` | `config.ts`               | The Asana workspace for the new tasks: look up its ID with the user's Asana connection                            |
| `ASANA_PROJECT_ID`   | `config.ts`               | The Asana project for the new tasks: pick it from that workspace's project list                                   |
| `USER_NAME_AND_ROLE` | `config.ts`               | The user's name and team or job, so the AI extracts the action items that are theirs                              |

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `granola` to the user's Granola connection, `ai` to AI by Zapier, and `asana` to the user's Asana connection. The Granola connection must be the account whose folders hold the meeting notes.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-meeting.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_meeting`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Granola trigger's output fields with the user's connection before the first test run, and the Asana `create_task_v2` and AI by Zapier `get_completion` fields with the same connections. Fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) using a test note the user creates for this, not a real meeting:

```json
{
  "id": "test-note-0001",
  "calendar_event_title": "[install-test] Weekly planning",
  "calendar_event_time": "2026-01-05T10:00:00Z",
  "my_notes": "Action: send the draft budget to finance by Friday. Priya to confirm the venue.",
  "enhanced_notes": "",
  "transcript": ""
}
```

Confirm that one Asana task appears in the test project for the budget action, with its priority, due date and source in the description. The user deletes the test task, not the agent.

## Notes

- Every new note in the folder runs the extraction. Keep the folder to meetings that have action items, or the project fills with noise.
- Asana tasks are created directly. The template's Slack approval step (approve or ignore each extracted task before it is created) is not part of this build; add a review step before the Asana step if the team needs one.
- The Asana task description holds the priority as text, not as a custom field. Map it to a custom field in Asana if the project has one.
- Never commit a real Granola folder ID, Asana workspace or project ID, or a real meeting note.
