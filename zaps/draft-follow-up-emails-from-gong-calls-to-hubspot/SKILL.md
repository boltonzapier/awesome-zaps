---
name: draft-follow-up-emails-from-gong-calls-to-hubspot
description: Build a Zap on Zapier that turns each new Gong call into a personalized follow-up email draft with AI, then creates a HubSpot follow-up task for the call owner and sends the owner a Slack message with links to the draft and the task. Use when sales reps should get a ready-to-send follow-up after every call instead of writing it from memory.
license: MIT
metadata:
  author: zapier
  summary: "Every Gong call becomes a personalized follow-up email draft, with a HubSpot task to send it and a Slack message with the draft and task links."
  apps: "Gong, HubSpot, Slack, AI by Zapier"
  category: "Sales"
  job: "Sales operations"
  source: "https://zapier.com/templates/details/automate-sales-follow-up-emails-gong-hubspot"
---

# Smart follow-up emails: From Gong calls to AI followup drafts

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/draft-follow-up-emails-from-gong-calls-to-hubspot. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new Gong call is processed (`gong`, `new_call_webhook`).
2. **Gong** (API requests through the user's Gong connection) fetches the call's transcript and its extensive call record (parties, organizer).
3. **Workflow** finds the organizer, the first external attendee (the recipient) and the first internal attendee (the host). It stops, with no draft, if the organizer isn't in HubSpot or Slack, or if the call has no external attendee.
4. **AI by Zapier** writes the email subject, the plain-text email body and a two-to-three sentence call summary.
5. **HubSpot** creates a task for the organizer, due in 24 hours, with the summary and a link to the email draft.
6. **Slack** sends the organizer a direct message with the summary, the email draft and the HubSpot task.

The Zap never sends an email. The organizer opens the draft and sends it.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting             | Where       | What goes there                                                                               |
| ------------------- | ----------- | --------------------------------------------------------------------------------------------- |
| `GONG_API_BASE_URL` | `config.ts` | The API base URL from the user's Gong API settings, for example `https://us-1234.api.gong.io` |

The HubSpot and Slack connections need no setting. The Zap finds the call organizer by email in each.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `gong` to the user's Gong connection, `hubspot` to their HubSpot connection, and `slack` to their Slack connection. The organizer must exist in both HubSpot and Slack under the same email. `ai` uses AI by Zapier. The Gong API requests go through the `gong` connection, so no API key is needed.
2. **Source:** publish `workflow.ts`, `config.ts` and `lib/follow-up.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-call.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_call_webhook`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the HubSpot `find_owner_by_email` and `create_engagement` actions, the Slack `user_by_email` and `direct_message` actions, and the Gong trigger's output with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a Gong call the user recorded with themselves as the only external-looking attendee, or a test call. The HubSpot task and Slack message go to the organizer, so use a test account the user owns:

```json
{
  "callData": {
    "metaData": {
      "id": "1234567890000000000",
      "title": "[install-test] Discovery call"
    }
  }
}
```

Confirm that one HubSpot task appears for the organizer with the summary and draft link, and that the Slack message arrives with a working email draft. The user deletes the test task, not the agent.

## Notes

- The Zap drafts the email and creates the task. Nothing is sent to the prospect until the organizer sends the draft.
- Every completed Gong call with an external attendee creates a task and a message. Limit the Gong trigger to the workspace or call types you want if that's too many.
- The Gmail compose link opens in the organizer's browser, so it works with the Gmail account they're signed into.
- Never commit a Gong credential, a Gong base URL, or a real call ID. The Gong requests authenticate through the `gong` connection.
