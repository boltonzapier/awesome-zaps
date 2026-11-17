---
name: send-whatsapp-alerts-for-new-gmail-emails
description: Build a Zap on Zapier that sends a WhatsApp notification when a new email arrives in Gmail, with the sender's name and a link to the email. Use when a team needs to hear about incoming Gmail messages quickly on WhatsApp and reply in time.
license: MIT
metadata:
  author: zapier
  summary: "Notify your team via WhatsApp when a new email arrives in Gmail, with the sender and a link to reply."
  apps: "Gmail, WhatsApp Notifications"
  category: "Business Owners"
  job: "Team communication"
  source: "https://zapier.com/templates/details/94923986275c6a06f93574f7cbf587f34f9f7fc853f9630a3621061cbaa39e34"
---

# Notify via WhatsApp when new email arrives in Gmail

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/send-whatsapp-alerts-for-new-gmail-emails. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new email arrives in the watched Gmail label or mailbox (`gmail`, `message`, "New Email"). The trigger brings the email's ID, sender name and sender address.
2. **WhatsApp Notifications** sends the "New message from [Name]. Reply now at: [Link]" template to the connected WhatsApp number. The name is the sender's name, or their address if there is no name. The link opens the email in Gmail.

The message carries the sender and the link only. It does not include the subject or the body.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve labels to IDs with the user's Gmail connection; don't ask them to paste an ID you can look up.

| Setting            | Where                                | What goes there                                                                                   |
| ------------------ | ------------------------------------ | ------------------------------------------------------------------------------------------------- |
| `REPLACE_LABEL_ID` | `triggers/new-email.ts`, `label_ids` | The label or mailbox to watch. `INBOX` is the inbox. Left empty, the trigger fires on drafts too. |

Also confirm which WhatsApp Notifications connection receives the message. Its number is the recipient, so it must be the number the team reads.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

Trigger: app `gmail`, event `message`. Connections: `gmail`, `whatsapp-notifications`.

1. **Connections:**
   - `gmail`: bind to the user's Gmail connection for the account whose mail should trigger the notification. The trigger uses the same connection.
   - `whatsapp-notifications`: bind to the user's WhatsApp Notifications connection. Its number is the recipient.
2. **Source:** publish `workflow.ts` and `config.ts`. `triggers/new-email.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. Replace `REPLACE_LABEL_ID` in the trigger file with the user's answer. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with `gmail`, find the row whose `key` is `message`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the WhatsApp Notifications action's fields with the user's connection before the first test run. The `send_message` action takes `template` (use `message_reminder`), `name` and `link_to_reply`. Fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP). Use an email the user sent to themselves for this, not one from a real contact:

```json
{
  "id": "18c0a1b2c3d4e5f6",
  "from__name": "Test Sender",
  "subject": "[install-test] new email",
  "date": "2026-11-17T09:00:00Z"
}
```

Check that the WhatsApp message reads "New message from Test Sender" and that its link opens the email in Gmail. If run-status tools aren't available, check the WhatsApp chat directly.

## Customize

- To notify on only some mail, use the trigger's Gmail search or a label rather than the inbox.
- To add the subject, change the template to one that takes it, then add the field to `send_message`'s inputs.

## Notes

- The link is built from the email's ID in `config.ts` (`GMAIL_LINK_BASE`). If Gmail's web address changes, change it there.
- The template and its text come from WhatsApp Notifications. Changing the wording means choosing another template, not editing the message in the Zap.
