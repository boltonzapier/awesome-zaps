---
name: create-asana-tasks-from-starred-gmail-emails-with-ai
description: Build a Zap on Zapier that turns each Gmail email the user stars into Asana tasks. AI reads the email and extracts the actions the user must take, with due dates, and attaches the email's files and notifies the user in Slack. Use when someone stars emails to track follow-ups and wants them in Asana without copy-pasting.
license: MIT
metadata:
  author: zapier
  summary: "Star a Gmail email and AI turns it into Asana tasks with due dates, attached files and a Slack notification."
  apps: "Gmail, Asana, AI by Zapier, Slack"
  category: "Personal Productivity"
  job: "Task management"
  source: "https://zapier.com/templates/details/email-assistant-turn-starred-emails-into-asana-tasks-with-ai"
---

# Email assistant: Turn starred emails into Asana tasks with AI

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/create-asana-tasks-from-starred-gmail-emails-with-ai. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** the user stars an email in Gmail (`gmail`, `star_message`).
2. **Workflow** skips the email if it has no subject, or if the sender's address contains `noreply`.
3. **AI by Zapier** (`ai`, `get_completion`) reads the email body and returns the actions the user must complete, each with a short name, a description and a due date in `YYYY-MM-DD` form. Tasks for other people are ignored. With no date in the email, the due date is three days from today.
4. **Asana** (`asana`, `create_task_v2`) creates one task per action in the chosen workspace and project. The task description holds the action's details, the email body and a link to the email.
5. **Asana** (`asana`, `attach_file`) attaches the email's files to each new task, when the email has any.
6. **Slack** (`slack`, `direct_message`) sends a message with a link to each new task.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting              | Where       | What goes there                                                                                                         |
| -------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- |
| `ASANA_WORKSPACE_ID` | `config.ts` | The Asana workspace for the tasks: pick it from the workspace list on the user's Asana connection                       |
| `ASANA_PROJECT_ID`   | `config.ts` | The project for the tasks, inside that workspace: pick it from the project list on the user's Asana connection          |
| `ASANA_ASSIGNEE_ID`  | `config.ts` | The person the tasks are assigned to, usually the user: pick them from the assignee list on the user's Asana connection |
| `SLACK_CHANNEL`      | `config.ts` | Where the notification goes, a channel or the user's own `@username`: look it up with the user's Slack connection       |

The defaults `AI_MODEL` and `NO_REPLY_MARKER` in `config.ts` can stay as they are unless the user asks for a different model.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `gmail` to the user's Gmail connection for the mailbox whose starred emails should become tasks. Bind `asana` to the user's Asana connection, `slack` to their Slack connection, and `ai` to their AI by Zapier connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-starred-email.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create and publish the workflow. Build only: do not test-run or enable it without asking the user first.
4. **Fields:** inspect the Asana `create_task_v2` and `attach_file` actions, the Slack `direct_message` action and the AI `get_completion` output with the user's connections before the first run, and fix any key in `workflow.ts` that doesn't match. In particular, confirm that the AI step returns its array under `result`, and that the Gmail trigger output has `message_id`, `subject`, `body_plain`, `message_url`, `from` and `all_attachments`.

## Test it

Test only with the user's approval, and only with a Gmail message they sent to themselves, a test Asana project and a Slack channel they own. Run this sample as a draft test (`run_workflow_draft` in Zapier MCP):

```json
{
  "message_id": "18c0example",
  "subject": "[install-test] Send the Q3 numbers by Friday",
  "body_plain": "Please finalize the Q3 report by Friday and confirm the venue for next week's client meeting.",
  "message_url": "https://mail.google.com/mail/u/0/#inbox/18c0example",
  "from": { "email": "test@example.com" },
  "all_attachments": []
}
```

Confirm that one or two tasks appear in the test project with due dates, and that the Slack message links to them. If run-status tools aren't available, check the project and the channel directly. The user deletes the test tasks, not the agent.

## Notes

- Every starred email runs the AI step, so each one uses AI credits.
- Gmail's starred-email trigger fires for an email starred within two days of arriving.
- AI can misread a due date or miss an action. The task description keeps the email body and link so the user can check.
- Never commit a real workspace, project, channel or email address.
