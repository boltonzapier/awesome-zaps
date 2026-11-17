---
name: summarize-zoom-one-on-ones-and-coach-managers-with-ai
description: Build a Zap on Zapier that waits for each Zoom cloud recording of a one-on-one, reads its transcript, scores the manager's talk/listen ratio, writes AI coaching feedback and a meeting summary, logs them to a Zapier Table with the past two months of feedback trends, and sends the manager a Slack DM. Use when a manager wants coaching and a written recap after every one-on-one without taking notes by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every one-on-one recorded on Zoom gets a meeting summary and AI coaching feedback, logged to a table and sent to you in Slack with your feedback trend."
  apps: "Zoom, AI by Zapier, Zapier Tables, Slack"
  category: "Human Resources (HR)"
  job: "Performance management"
  source: "https://zapier.com/templates/details/one-on-one-meeting-coach-and-summary"
---

# One-on-one meeting coach: AI-powered skill-building for managers

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/summarize-zoom-one-on-ones-and-coach-managers-with-ai. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a Zoom cloud recording completes (`zoom`, `new_recording`). The Zap skips recordings whose topic doesn't contain the one-on-one title text.
2. **Wait** 30 minutes, so Zoom has time to write the audio transcript.
3. **Zoom** gets the recording's files, and the Zap downloads the audio transcript.
4. **Workflow** turns the transcript into speaker turns and works out the manager's talk/listen ratio.
5. **AI by Zapier** writes coaching feedback (strengths, areas for improvement, overall assessment) and a meeting summary (discussion notes, action items, feedback given).
6. **Zapier Tables** reads the past two months of feedback rows, and **AI by Zapier** writes a trend analysis against today's feedback.
7. **Zapier Tables** logs the meeting, its feedback and recap as a new row.
8. **Slack** sends the manager a direct message with the feedback, the talk/listen ratio and the trend.

The Zap only reads recordings and writes to its own table and Slack DM. It never changes a Zoom recording.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                 | Where       | What goes there                                                                                                                             |
| ----------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `ZOOM_HOST_NAME`        | `config.ts` | The user's name exactly as it appears in their Zoom profile. The transcript labels speakers by name, so this finds the manager's talk time. |
| `ONE_ON_ONE_TITLE_TEXT` | `config.ts` | Words their one-on-one meeting titles contain, such as `1:1`. Only matching recordings are coached.                                         |
| `FEEDBACK_TABLE_ID`     | `config.ts` | The Zapier Table that holds the coaching log: ask which table it is, then look up its ID with the user's Zapier Tables connection           |
| `SLACK_USER_ID`         | `config.ts` | The user's own Slack user ID (starts with `U`): look it up with the user's Slack connection                                                 |

Also review the defaults with them:

- `FEEDBACK_COLUMNS`: the table's column keys in order (`f1` is the first column). Map title, date, feedback and recap to the user's columns, or change the keys to match.
- `TRANSCRIPT_WAIT_SECONDS`: how long to wait after a recording before fetching its transcript. 1800 (30 minutes) is the default.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `zoom` to the user's Zoom connection for the account that hosts the meetings, `ai` to AI by Zapier, `zapier-tables` to the user's Zapier Tables connection, and `slack` to the user's Slack connection.
2. **Source:** publish `workflow.ts`, `config.ts` and `lib/meeting-coach.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-recording.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_recording`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Zoom `_zap_raw_request` action, the Zapier Tables `find_records` and `create_record` actions, and the Slack `direct_message` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a test recording the user made for this, with a title containing the one-on-one text. Use the user's own test table and their own Slack DM, not a live feedback log:

```json
{
  "uuid": "test-uuid-0001",
  "topic": "Test 1:1 with a direct report",
  "start_time": "2026-01-15T16:00:00Z"
}
```

Confirm that one row appears in the feedback table with the title, date, feedback and recap, and that the Slack DM shows the feedback and the talk/listen ratio. The user deletes the test row and the test recording, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every Zoom recording whose topic contains the one-on-one text gets coached. Keep the title text specific enough that team meetings are skipped.
- The talk/listen ratio counts seconds of speech in the transcript, so it is only as good as Zoom's speaker labels.
- The trend analysis reads only the past two months of rows in the feedback table, so the table should hold one row per meeting.
- Never commit a real Zoom name, Slack user ID or Zapier Table ID.
