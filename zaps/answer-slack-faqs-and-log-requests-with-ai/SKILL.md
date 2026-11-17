---
name: answer-slack-faqs-and-log-requests-with-ai
description: Build a Zap on Zapier that answers each new question posted in a Slack help channel from a FAQ in a Zapier Table, using AI by Zapier, and logs the questions the FAQ can't answer as requests in a second Zapier Table for your team. Use when employees ask the same questions in Slack and you want a self-service answer first, with a tracked request for anything left over.
license: MIT
metadata:
  author: zapier
  summary: "Questions posted in your help channel get an answer from your FAQ table; anything it can't answer is logged as a request in your help requests table and the thread says so."
  apps: "Slack, Zapier Tables, AI by Zapier"
  category: "Customer Service & Success"
  job: "Self service support"
  source: "https://zapier.com/templates/details/helpdesk-automation-template-slack-clickup"
---

# Manage FAQs and requests from Slack with AI

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/answer-slack-faqs-and-log-requests-with-ai. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new message is posted to the help channel (`slack`, `channel_message`). Bot posts are ignored.
2. **Workflow** skips replies inside an existing thread and empty messages, since those are not new questions.
3. **Zapier Tables** (`zapier-tables`) reads every record in the FAQ table.
4. **AI by Zapier** (`ai`) reads the question against those FAQ records. It answers only when the FAQ clearly covers the question.
5. **If it answers,** Slack replies in the question's thread with the answer.
6. **If it doesn't,** Zapier Tables adds a record to the help requests table with the question, the requester's email, the Slack link and the thread timestamp, with the escalate box ticked. Slack replies in the thread that the support team has it.

The Zap only reads the FAQ table and adds to the help requests table. It never edits or deletes records, and it never changes Slack messages other than replying in the thread.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting            | Where                                                       | What goes there                                                                                                     |
| ------------------ | ----------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `SLACK_CHANNEL_ID` | `config.ts`, and `channel` in `triggers/channel-message.ts` | The help channel where questions are posted: look up its ID (C…) with the user's Slack connection                   |
| `FAQ_TABLE_ID`     | `config.ts`                                                 | The Zapier Table of FAQ questions and answers: ask which table it is, then take its ID from the table's URL         |
| `HELP_TABLE_ID`    | `config.ts`                                                 | The Zapier Table where unanswered requests are logged: ask which table it is, then take its ID from the table's URL |

Use the same channel ID in both places, or the replies and the trigger will watch different channels.

Also review the field IDs with the user. `FAQ_QUESTION_FIELD` (`f1`) and `FAQ_ANSWER_FIELD` (`f2`) are the FAQ table's question and answer columns. The `HELP_*_FIELD` values (`f1`, `f2`, `f3`, `f6`, `f7`) are the help requests table's request, requester, escalate, Slack link and thread timestamp columns. Map them to the user's columns if they differ, and add a Checkbox column for the escalate flag.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `slack` to the user's Slack connection for the workspace with the help channel, and `zapier-tables` to the user's Zapier Tables connection for the account that owns both tables. `ai` runs on AI by Zapier's managed credentials and needs no connection of its own.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/channel-message.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Slack `channel_message` trigger's output, the Zapier Tables `find_records` and `create_record` fields, and the AI by Zapier `get_completion` outputs with the user's connections before the first test run. Confirm the Tables find-records output is a list of records whose `data` holds the FAQ fields, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) in a test channel the user owns, with a test FAQ and a test help requests table, not their live ones:

```json
{
  "ts": "1700000000.000100",
  "text": "How do I request a new laptop?",
  "permalink": "https://example.slack.com/archives/C000000/p1700000000000100",
  "user": { "profile": { "email": "test.user@example.com" } }
}
```

Confirm that the reply shows an answer from the test FAQ, or that one new help request row appears with the question and the escalate box ticked and the thread reply says the support team has it. If run-status tools aren't available, check the reply and the table directly. The user deletes the test reply and row, not the agent.

## Notes

- Every top-level message in the channel is treated as a question. To answer only messages with a reaction, change the trigger to Slack's `new_reaction_added_v3` event.
- The AI only sees the FAQ table's records. Keep the FAQ short and current, since the AI cannot answer from anything else.
- The template this came from also ran ClickUp tasks, priority prompts, reaction-based feedback and an FAQ builder from the thread history. Those are not in this zap; add them as separate zaps if you need them.
- Never commit a real Slack channel ID, table ID or email address.
