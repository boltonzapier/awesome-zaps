---
name: respond-to-slack-mentions-with-chatgpt-support-answers
description: Build a Zap on Zapier that answers each new Slack mention of the support account with a ChatGPT reply, posted in the same thread. Use when teammates ask support questions by mentioning a person or bot in public Slack channels and want a fast first answer.
license: MIT
metadata:
  author: zapier
  summary: "Each public Slack mention of your support account gets a ChatGPT answer in the same thread, so questions get a timely first reply."
  apps: "Slack, ChatGPT (OpenAI)"
  category: "Customer Service & Success"
  job: "Customer support operations"
  source: "https://zapier.com/templates/details/0887125cb5260ae5f5e74ba405e58f62f799718b31d815af0898ff4a19b4baf6"
---

# Respond to user mentions in Slack with AI-generated support answers

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/respond-to-slack-mentions-with-chatgpt-support-answers. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new public channel message mentions the support account (`slack`, `mention_v2`). Bot messages are ignored.
2. **Workflow** removes the mention from the text, skips mentions with no question, and sends the rest to ChatGPT with a short support prompt.
3. **ChatGPT** writes the answer. The Zap polls for it until it is ready, for up to ten minutes.
4. **Slack** posts the answer in the mention's thread, or starts a thread under a top-level mention.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                 | Where                                 | What goes there                                                                                                                        |
| ----------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `REPLACE_SLACK_USER_ID` | `user_id` in `triggers/mention-v2.ts` | The Slack user whose mentions get answers, such as the support account: pick it from the user list on the user's Slack connection (U…) |

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `slack` to the user's Slack connection for the workspace where people mention the support account, and `chatgpt` to the user's ChatGPT (OpenAI) connection.
2. **Source:** publish `workflow.ts` and `config.ts`. `triggers/mention-v2.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them, with `REPLACE_SLACK_USER_ID` replaced by the user's answer. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the ChatGPT `conversation_responses_api` action and the Slack `channel_message` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match. Confirm the mention event's payload has `channel`, `ts`, `thread_ts` and `text`, and map any name that differs.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) in a test channel the user owns, with the support account mentioned in it:

```json
{
  "ts": "1700000000.000200",
  "channel": "C0123456789",
  "text": "<@U0123456789> how do I reset my password for the staging portal?",
  "user": { "name": "test.user", "real_name": "Test User" }
}
```

Replace the sample `channel` with the test channel's ID before running. Confirm that the thread reply contains a short ChatGPT answer about password resets. The user deletes the test message, not the agent.

## Notes

- Every public mention opens an answer. To answer only mentions in one channel, add the channel to the trigger's filters in the Zapier editor.
- The reply has no review step, so the system prompt in `config.ts` is the only guard on what it says. Read it before publishing.
- Mentions inside threads are answered in that thread, so follow-up questions get the same treatment.
- To answer private channel mentions too, set `public_only` to `false` in the trigger.
