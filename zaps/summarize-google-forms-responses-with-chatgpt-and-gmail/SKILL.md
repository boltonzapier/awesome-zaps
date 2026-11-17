---
name: summarize-google-forms-responses-with-chatgpt-and-gmail
description: Build a Zap on Zapier that reads each new Google Forms client response, has ChatGPT summarize its key themes and potential flags, and emails the summary through Gmail to a coaching team. Use when a coaching or client success team collects client questionnaires in Google Forms and wants each one summarized for targeted follow-up.
license: MIT
metadata:
  author: zapier
  summary: "Each new client questionnaire response is summarized by ChatGPT into themes and flags, and the summary is emailed to your coaching team through Gmail."
  apps: "Google Forms, ChatGPT (OpenAI), Gmail"
  category: "Customer Service & Success"
  job: "Customer success operations"
  source: "https://zapier.com/templates/details/c68c5187045332be3e08bfa86df8db8b8c5ac5b1f5250558d84141935e1d93ea"
---

# Analyze client responses in Google Forms, summarize with ChatGPT, and email coaching team via Gmail

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/summarize-google-forms-responses-with-chatgpt-and-gmail. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new response is submitted to the client questionnaire (`google-forms`, `new_form_response`). The form to watch is chosen when the trigger is configured.
2. **ChatGPT** reads the response and writes a summary: the key themes in the client's career, and any potential flags the coaches should follow up on.
3. **Gmail** sends that summary as an email to the coaching team.

The Zap only reads the form and sends the summary. It never edits the form or replies to the client.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting               | Where                           | What goes there                                                                                          |
| --------------------- | ------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `formId`              | `triggers/new-form-response.ts` | The client questionnaire: pick it from the form list on the user's Google Forms connection               |
| `COACHING_TEAM_EMAIL` | `config.ts`                     | The address that receives each summary, such as a team inbox or group. Ask the user which address it is. |

Also review the defaults with them:

- `INSTRUCTIONS`: what ChatGPT looks for in each response. The default covers key themes, potential flags and suggested follow-up.
- `EMAIL_SUBJECT`: the subject line of each summary email.
- `MODEL`: the ChatGPT model that writes the summary.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-forms` to the user's Google Forms connection for the account that owns the questionnaire, `chatgpt` to the user's ChatGPT (OpenAI) connection, and `gmail` to the user's Gmail connection for the account that sends the summaries.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-form-response.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_form_response`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the ChatGPT `conversation_responses_api` action and the Gmail `message` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match. Confirm the ChatGPT action returns its text in `output`.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using a test response the user submitted to a test copy of the form:

```json
{
  "Full name": "Test Client",
  "Current role": "Marketing coordinator, five years in the same role",
  "What would you like to change in the next year?": "Move into a people-management role.",
  "What is getting in the way?": "No clear path internally and little time to study."
}
```

Confirm that the summary email arrives at the coaching team address, with the sections the instructions ask for and no invented details. The user deletes the test response, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every new response is sent to ChatGPT and emailed to the coaching team. Keep the form to questions that are fine to share with that team.
- The response is sent to ChatGPT as JSON, one entry per question, capped at `MAX_RESPONSE_CHARS` characters.
- Never commit a real form ID, a real team address or a real client response.
