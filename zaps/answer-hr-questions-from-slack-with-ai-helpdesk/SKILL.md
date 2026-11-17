---
name: answer-hr-questions-from-slack-with-ai-helpdesk
description: Build a Zap on Zapier that answers each new HR question posted in a Slack channel from an FAQ table using AI, replies in the thread, and logs every request to a Zapier Table. Questions the FAQs don't cover are escalated to the HR team. Use when employees ask HR questions in Slack and the HR team wants instant answers to common ones.
license: MIT
metadata:
  author: zapier
  summary: "Each new HR question in your Slack channel gets an instant answer from your FAQ table, or is escalated to HR, and every request is logged in a Zapier Table."
  apps: "Slack, AI by Zapier, Zapier Tables"
  category: "Human Resources (HR)"
  job: "HR operations"
  source: "https://zapier.com/templates/details/automate-hr-support-ai-helpdesk-assistant"
---

# Automate HR support with AI helpdesk assistant

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/answer-hr-questions-from-slack-with-ai-helpdesk. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new message is posted to the HR help channel (`slack`, `channel_message`). Bot posts and threaded replies are ignored.
2. **Slack** replies in the thread: "Processing your request, hang tight!"
3. **Zapier Tables** reads every row of the HR FAQ table.
4. **AI by Zapier** answers the question using only those FAQ rows. If they don't cover it, it returns a fixed "NO RESPONSE" phrase.
5. **Zapier Tables** adds a row to the HR request table with the question, the requester's email, the Slack link, the time, the AI answer (if any), and whether the request was escalated or answered.
6. **Slack** replies in the thread with the answer, or says the request has been escalated to the HR team.

Every new question gets a request row. The Zap never edits Slack messages or anyone's HR records.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting             | What goes there                                                                                                                      |
| ------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `channel` (trigger) | The Slack channel employees post HR questions in. Look up its ID (`C…`) with the user's Slack connection.                            |
| `SLACK_CHANNEL_ID`  | The same channel. Keep it identical to the trigger's value.                                                                          |
| `FAQ_TABLE_ID`      | The Zapier Table of HR FAQs: ask which table it is, then look up its ID in the table's URL with the user's Zapier Tables connection. |
| `REQUEST_TABLE_ID`  | The Zapier Table that logs HR requests, looked up the same way. It needs the columns named in `config.ts`.                           |

Also review the defaults with them:

- `MODEL_ID`: `standard/auto` lets Zapier pick a model. Change it only if the user wants a specific one.
- The FAQ and request column keys (`FAQ_QUESTION_FIELD`, `REQUEST_TEXT_FIELD` and the rest): keys such as `f1` are the table's columns in order, not header names. Map the user's headers to their column positions.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `slack` to a Slack connection for a workspace member who can read and post in the HR channel, and `zapier-tables` to the connection that owns both tables.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/channel-message.ts` and `connections/` are settings: set the workflow's trigger and connection bindings from them. For the trigger's `selected_api`, call `search_triggers` with the slug `slack`, find the row whose `key` is `channel_message`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields, the Zapier Tables `find_records` and `create_record` actions, and the AI `get_completion` action with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), in a test channel the user owns, with a question that is in the FAQ table and a second one that is not:

```json
{
  "ts": "1700000000.000100",
  "text": "How do I update my benefits?",
  "permalink": "https://example.slack.com/archives/C0123456789/p1700000000000100",
  "user": { "id": "U0000000000", "profile": { "email": "test@example.com" } }
}
```

Confirm that the thread gets the acknowledgement and then an answer, and that one row appears in the request table with the answer filled in and "Successfully deflected" set. Repeat with a question the FAQs don't cover: the thread should get the escalation message and the row should be marked escalated. If run-status tools aren't available, check the thread and the table directly. The user deletes the test rows, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every top-level message in the channel is answered or escalated. Keep the FAQ table current, because the AI answers only from it.
- The AI answers only from the FAQ rows it is given. It can be wrong when the FAQs are vague, so the HR team should review the request table.
- Never commit a real channel ID, table ID or email address.
