---
name: create-automated-email-reply-drafts-in-gmail
description: Build a Zap on Zapier that drafts a reply in Gmail to each new inbox email, written in the user's own tone and checked against their calendar and the web, with nothing sent automatically. Use when someone wants reply drafts prepared for their review instead of writing every reply from scratch.
license: MIT
metadata:
  author: zapier
  summary: "Every new inbox email gets a draft reply in your own tone, with meeting times from your calendar and web research where needed, ready for you to review and send."
  apps: "Gmail, Google Calendar, AI by Zapier"
  category: "Personal Productivity"
  job: "Email management"
  source: "https://zapier.com/templates/details/automated-email-reply-drafts-agent-76a3e6"
---

# Automated Email Reply Drafts Agent

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/create-automated-email-reply-drafts-in-gmail. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new email arrives in the inbox (`gmail`, `message`).
2. **Gmail** finds recent sent mail, to sample the user's tone and sign-offs.
3. **Google Calendar** lists the events in the next few weeks, to offer meeting times.
4. **AI by Zapier** reads the email, the sent-mail sample and the calendar, searches the web for the sender or a resource when that helps, and writes the reply. It returns `NO_REPLY` for automated mail such as invitations and receipts, and politely declines sales pitches.
5. **Gmail** creates a draft reply in the email's thread. Nothing is sent. The user reviews each draft and sends it themselves.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting       | What goes there                                                                                                                                             |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CALENDAR_ID` | The calendar that shows the user's availability, usually their own email address: ask which one, then look it up with the user's Google Calendar connection |

Also review the defaults with them:

- `SENT_MAIL_QUERY`: the Gmail search for sent mail used as a writing sample. `in:sent` is the default.
- `CALENDAR_LOOKAHEAD`: how far ahead the calendar is read for meeting times. `+2 weeks` is the default.
- `MEETING_TIME_ZONE`: the time zone for proposed meeting times. `America/Chicago` is the default; change it to the user's own zone.
- `MODEL_ID`: the model tier for the AI step. `premium/auto` is the default.
- `label_ids` (trigger, `triggers/message.ts`): the mailbox that starts the Zap. `INBOX` is the default.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `gmail` to the user's Gmail connection, and `google-calendar` to their Google Calendar connection. The AI step needs no connection; it uses AI by Zapier's managed model credentials (`authentication_id: "0"`).
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/message.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `message`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow. For the AI step's configuration, read `get_zapier_skill("zapier:ai-by-zapier")`.
4. **Fields:** inspect the trigger's output fields and the actions' fields with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match. The actions it uses are `gmail` `message` (search), `google-calendar` `event_v2` (search), `ai` `get_completion` (write) and `gmail` `draft_v2_reply` (write).

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using a test email the user sent to themselves for this, not a real one:

```json
{
  "message_id": "18c0example",
  "subject": "Lunch next week?",
  "snippet": "Are you free for lunch on Tuesday or Wednesday?",
  "body_plain": "Hi, are you free for lunch on Tuesday or Wednesday? Let me know what works.",
  "from": { "name": "Test Sender", "email": "test@example.com" }
}
```

Confirm that a draft reply appears in the thread of that test email, in the user's tone, with meeting times that match their calendar. Nothing should have been sent. If run-status tools aren't available, check the draft in Gmail directly. The user deletes the test draft, not the agent.

## Notes

- The Zap only creates drafts. It never sends mail, changes labels or deletes anything. The user sends each reply.
- The AI step can search the web and read pages through AI by Zapier's `web_search` and `web_scrape` tools. Those reads happen on every run that drafts a reply, so they add cost and time.
- Gmail's Find Email step returns the messages it matches for `SENT_MAIL_QUERY`. Its voice sample is only as good as what that search returns.
- Gmail sender addresses and calendar contents are sent to the AI step on each run. Keep the calendar limited to the calendar the user wants shared with the model.
- Never commit a real calendar ID or a real sender address into this folder.
