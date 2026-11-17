---
name: coach-reps-from-gong-calls-with-ai-in-slack
description: Build a Zap on Zapier that scores each new Gong call longer than ten minutes against a six-part sales coaching rubric, logs the scores and feedback to a Zapier Table, and sends the rep a Slack summary. Notifies the rep's manager when a call scores low. Use when sales or customer success managers want AI coaching on every recorded call without listening to each one.
license: MIT
metadata:
  author: zapier
  summary: "Every new Gong call gets scored and coached by AI, with the feedback logged to a table and sent to the rep in Slack, and low scores flagged to the manager."
  apps: "Gong, Slack, Zapier Tables, AI by Zapier"
  category: "Sales"
  job: "Sales operations"
  source: "https://zapier.com/templates/details/call-coach-ai-sales-success-coaching"
---

# Gong call coach: AI-powered sales and success coaching

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/coach-reps-from-gong-calls-with-ai-in-slack. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new call is processed in Gong (`gong`, `new_call_webhook`).
2. **Workflow** skips calls of ten minutes or less, and calls where no attendee is listed in the team directory.
3. **Zapier Tables** finds the rep among the call's attendees in the team directory, and works out which Gong speaker is that rep.
4. **Gong** (API request through the user's Gong connection) pulls the full call transcript.
5. **AI by Zapier** scores the rep from 1 to 5 on six criteria (opening, questioning, rapport, value, commitment, flow), gives feedback on each, and gives feedback on Gong's five interaction statistics (talk ratio, longest monologue, longest customer story, interactivity, patience).
6. **AI by Zapier** writes feedback on the rep's custom coaching area, if the rep has one in the team directory.
7. **AI by Zapier** writes a short Slack summary of strengths, areas for improvement and recommendations.
8. **Zapier Tables** logs one row to the feedback log with the scores, feedback and statistics.
9. **Slack** sends the summary to the rep. If the six scores add up to less than 15 out of 30, Slack also sends it to the rep's manager.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                   | Where       | What goes there                                                                                                                                                                            |
| ------------------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `TEAM_DIRECTORY_TABLE_ID` | `config.ts` | The Zapier Table listing each rep with email, Slack user ID, manager's email and custom coaching area: ask which table it is, then look up its ID with the user's Zapier Tables connection |
| `FEEDBACK_LOG_TABLE_ID`   | `config.ts` | The Zapier Table that holds the feedback rows: ask which table it is, then look up its ID with the same connection                                                                         |
| `GONG_API_BASE_URL`       | `config.ts` | The API base URL from the user's Gong API settings, for example `https://us-1234.api.gong.io`                                                                                              |

Also review the defaults with them:

- `TEAM_EMAIL_FIELD`, `TEAM_NAME_FIELD`, `TEAM_SLACK_ID_FIELD`, `TEAM_MANAGER_EMAIL_FIELD`, `TEAM_CUSTOM_COACHING_FIELD`: column keys such as `f1` in the team directory. `f1` is the first column. Map them to the user's columns.
- `FEEDBACK_COLUMNS`: column keys for the feedback log, in the column order the feedback table uses. Map them to the user's columns before building.
- `MIN_CALL_SECONDS` (600) and `ESCALATION_SCORE` (15): change them if the team wants different thresholds.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `gong` to the user's Gong connection, `slack` to their Slack connection, and `zapier-tables` to their Zapier Tables connection. `ai` uses AI by Zapier and needs no account of its own. The Gong transcript request goes through the `gong` connection, so no API key is needed.
2. **Source:** publish `workflow.ts`, `config.ts` and `lib/call-coach.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-call.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_call_webhook`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Gong `new_call_webhook` trigger's output with the user's Gong connection, the Zapier Tables `find_record` and `create_record` actions, and the AI by Zapier `get_completion` action before the first test run. Fix any key in `workflow.ts` that doesn't match. In particular, check the shape of the call data the trigger delivers (`callData.metaData`, `callData.parties`, `callData.interaction.interactionStats`) and of the transcript the Gong API request returns.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP). Set the team directory to a test table with the user's own email as the rep, and the Slack ID set to a channel they own, so no one else is messaged:

```json
{
  "callData": {
    "metaData": {
      "id": "1234567890000000000",
      "title": "[install-test] Discovery call",
      "started": "2026-01-01T15:00:00Z",
      "url": "https://app.gong.io/call?id=1234567890000000000",
      "duration": 1200
    },
    "parties": [
      { "emailAddress": "test.rep@example.com", "speakerId": "111" },
      { "emailAddress": "test.customer@example.com", "speakerId": "222" }
    ],
    "interaction": {
      "interactionStats": [
        { "name": "Talk Ratio", "value": "0.45" },
        { "name": "Longest Monologue", "value": "120" },
        { "name": "Longest Customer Story", "value": "90" },
        { "name": "Interactivity", "value": "35" },
        { "name": "Patience", "value": "0.6" }
      ]
    }
  }
}
```

Confirm that one row appears in the feedback log with the scores and feedback, and that the test Slack channel shows the summary. The user deletes the test row and the test workflow, not the agent.

## Notes

- Gong's call trigger delivers the attendees, not which one is the rep. The rep is the attendee whose email is in the team directory. Calls with no such attendee are skipped.
- The rep's speaker ID comes from the call's parties. A call with no rep match is skipped without an error.
- Scores come from the AI model's structured output, one category from 1 to 5 per criterion. The total is out of 30.
- The manager is notified only when the total is below `ESCALATION_SCORE` and the rep has a manager email in the directory.
- Feedback is generated by a language model. Review it with the rep before using it in performance decisions.
- Never commit a Gong credential, Gong base URL, table ID or Slack channel ID. The Gong request authenticates through the `gong` connection.
