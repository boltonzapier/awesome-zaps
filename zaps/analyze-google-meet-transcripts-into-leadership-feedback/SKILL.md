---
name: analyze-google-meet-transcripts-into-leadership-feedback
description: Build a Zap on Zapier that reads each new Google Meet transcript or notes doc, writes a coaching analysis of the leader's communication and decisions, and appends it to one feedback doc. Use when a leader wants evidence-based feedback after every meeting instead of waiting for formal reviews.
license: MIT
metadata:
  author: zapier
  summary: "Every new Google Meet transcript gets a coaching analysis of your communication and decisions, appended to one feedback doc."
  apps: "Google Drive, Google Docs, AI by Zapier"
  category: "Executives"
  job: "Performance management"
  source: "https://zapier.com/templates/details/ai-leadership-coaching-google-meet-feedback-automation"
---

# Exec coach: Turn meeting insights into exec growth feedback by Tomás, CIO @ Miro

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/analyze-google-meet-transcripts-into-leadership-feedback. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new file lands in the Google Meet folder (`google-drive`, `file_in_folder_v2`).
2. **Workflow** skips any file whose title is not a meeting transcript or notes doc, then moves the file to the processed folder.
3. **Google Docs** reads the document. For a notes doc, only the text after its "Transcript" heading is used.
4. **AI by Zapier** writes a coaching analysis: strengths, growth areas, say-do gaps, decision-making, language patterns, energy, a blind-spot question, and start, stop and continue advice.
5. **Google Docs** appends that analysis to the feedback doc, after a divider line.

The Zap only reads and moves the meeting docs and appends to the feedback doc. It never sends email or changes the transcripts' contents.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting               | Where                           | What goes there                                                                                                                 |
| --------------------- | ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `folder`              | `triggers/file-in-folder-v2.ts` | The Drive folder that Google Meet saves transcript and notes docs into. Look up its ID with the user's Google Drive connection. |
| `CLIENT_NAME`         | `config.ts`                     | The full name of the leader being coached.                                                                                      |
| `CLIENT_TITLE`        | `config.ts`                     | That leader's job title.                                                                                                        |
| `CLIENT_COMPANY`      | `config.ts`                     | The leader's company.                                                                                                           |
| `PROCESSED_FOLDER_ID` | `config.ts`                     | The Drive folder that processed meeting docs move into.                                                                         |
| `FEEDBACK_DOC_ID`     | `config.ts`                     | The Google Doc that collects every analysis. Take its ID from the doc's URL.                                                    |

`AI_MODEL` defaults to `premium/auto`, which lets AI by Zapier pick the model on its managed credentials. Change it only if the user's team requires a specific provider.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-drive` and `google-docs` to the user's Google connection for the account that owns the Meet folder and the feedback doc, and `ai` to the AI by Zapier connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/file-in-folder-v2.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `file_in_folder_v2`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields, the Drive `move_file` action, the Docs `get_document_content` and `append` actions, and the AI `get_completion` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using a test doc the user made in a test folder:

```json
{
  "id": "example-transcript-doc-id",
  "title": "Test weekly sync - Transcript",
  "createdDate": "2026-01-15T10:00:00.000Z"
}
```

Confirm that the test doc moved to the processed folder and that one new analysis, starting with the `---` line and `ANALYSIS_BLOCK_START`, was appended to the feedback doc. If run-status tools aren't available, check the feedback doc directly. The user deletes the test analysis, not the agent.

## Notes

- Every Google Meet transcript and notes doc in the folder gets analyzed, so keep the folder to meetings the leader wants feedback on.
- The analysis quotes the transcript. Treat the feedback doc as private to the leader and their coach.
- Never commit a real Drive folder ID, doc ID or the name of a real leader.
