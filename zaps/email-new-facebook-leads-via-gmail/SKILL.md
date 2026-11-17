---
name: email-new-facebook-leads-via-gmail
description: Build a Zap on Zapier that emails a team member through Gmail whenever a new lead is submitted on a Facebook Page lead form, with the lead's name, email, phone and submission time, and a reply-to set to the lead. Use when a team needs to follow up on Facebook leads quickly and wants each one in their inbox.
license: MIT
metadata:
  author: zapier
  summary: "Each new Facebook lead is emailed to your team member with the lead's details, so follow-up starts right away."
  apps: "Facebook Lead Ads, Gmail"
  category: "Sales"
  job: "Lead management"
  source: "https://zapier.com/templates/details/c78e494572fa7972b702800cc0f82db3afe40e1614957c763439633a8e679cf2"
---

# Notify team member via email when new lead is generated from Facebook Lead Ads

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/email-new-facebook-leads-via-gmail. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a person submits a lead form on a Facebook Page (`facebook-lead-ads`, `lead`).
2. **Gmail** sends one email to the team member with the lead's full name, email, phone number, submission time and lead ID. Its reply-to is the lead's email, so replying goes straight to them.

The Zap sends one email per lead and never changes anything in Facebook or Gmail.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                    | Where                      | What goes there                                                                                                                          |
| -------------------------- | -------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| `REPLACE_FACEBOOK_PAGE_ID` | `triggers/lead.ts`, `page` | The Facebook Page whose lead forms start the Zap: ask which Page it is, then look up its ID with the user's Facebook Lead Ads connection |
| `NOTIFY_EMAIL`             | `config.ts`                | The address of the team member who gets each new lead: ask the user for it, and use the address they give                                |

Also review the defaults with them:

- The trigger listens to any form on the Page. To start it from one form only, add a `form` param in `triggers/lead.ts` with that form's ID.
- `SUBJECT_PREFIX`: the start of each email's subject; the lead's name follows it.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `facebook-lead-ads` to the user's Facebook Lead Ads connection for the Page, and `gmail` to the user's Gmail connection, the account that sends the notification.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/lead.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** sample a lead with the Facebook Lead Ads connection and confirm the keys `FULL_NAME`, `EMAIL`, `PHONE_NUMBER` and `created_time` exist. Facebook's standard questions arrive in uppercase; custom questions use the key the form defines, so rename the keys in `workflow.ts` to match. Check the Gmail `message` action's `to`, `subject`, `body` and `reply_to` fields with the user's connection before the first test run.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with a test lead the user sets up for this, not a real one. Send the notification only to the user's own address:

```json
{
  "id": "install-test-lead-0001",
  "created_time": "2026-11-17T10:15:00+0000",
  "FULL_NAME": "Test Lead",
  "EMAIL": "test@example.com",
  "PHONE_NUMBER": "+15555550100"
}
```

Confirm that one email arrived at `NOTIFY_EMAIL` with the lead's name, email, phone, time and ID, and that its reply-to is the lead's address. The user deletes the test email, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every new lead on the Page sends an email. Narrow the trigger to one form if the Page has several.
- Lead emails can carry personal details. Send them only to a team address the lead's data may go to.
- Never commit a real Facebook Page ID or a real team email address.
