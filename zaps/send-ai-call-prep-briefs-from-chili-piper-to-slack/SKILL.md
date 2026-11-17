---
name: send-ai-call-prep-briefs-from-chili-piper-to-slack
description: Build a Zap on Zapier that writes an AI call prep brief for every meeting booked through Chili Piper, from the guest's HubSpot contact, HubSpot company and Clearbit enrichment, then saves it to HubSpot and a Zapier Table and sends it to Slack the day before the meeting. Use when a sales team wants prepared, consistent briefs before each booked call without researching each guest by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every meeting booked through Chili Piper gets an AI brief from HubSpot and Clearbit, saved to HubSpot and your table, and sent to Slack the day before the call."
  apps: "Chili Piper, HubSpot, Clearbit, ChatGPT, Zapier Tables, Slack"
  category: "Sales"
  job: "Sales operations"
  source: "https://zapier.com/templates/details/call-prep-guide"
---

# Automatic call prep

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/send-ai-call-prep-briefs-from-chili-piper-to-slack. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a meeting is created in Chili Piper (`chili-piper`, `meeting_created`).
2. **Workflow** waits five minutes so HubSpot has the new contact, then looks up the guest in HubSpot by email and their company by email domain.
3. **Clearbit** enriches the company by domain.
4. **ChatGPT** writes a brief with a header and four sections: Attendee, Company, Meeting, and Potential Use Cases.
5. **HubSpot** saves the brief as a note on the guest's contact, when the guest exists in HubSpot.
6. **Zapier Tables** adds a row with the meeting name, time, brief, company, guest and host.
7. The workflow waits until the day before the meeting, then **Slack** sends the brief as a direct message. A meeting less than a day away gets its brief at once.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting              | Where       | What goes there                                                                                                        |
| -------------------- | ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| `TABLE_ID`           | `config.ts` | The Zapier Tables table that keeps the briefs: its ID is in the table's URL                                            |
| `MEETING_NAME_FIELD` | `config.ts` | The column for the meeting name: look up its field key with the user's Zapier Tables connection                        |
| `MEETING_DATE_FIELD` | `config.ts` | The column for the meeting date and time                                                                               |
| `PREP_BRIEF_FIELD`   | `config.ts` | The column for the brief text                                                                                          |
| `COMPANY_NAME_FIELD` | `config.ts` | The column for the guest's company                                                                                     |
| `ATTENDEE_FIELD`     | `config.ts` | The column for the guest's name                                                                                        |
| `HOST_FIELD`         | `config.ts` | The column for the meeting host                                                                                        |
| `HUBSPOT_ACCOUNT_ID` | `config.ts` | The HubSpot account number, which appears in any HubSpot record URL after `/contacts/`                                 |
| `SLACK_USER_ID`      | `config.ts` | The Slack user who receives the brief as a direct message: look up their user ID (U…) with the user's Slack connection |

Also review the defaults with the user: `MODEL` (`gpt-4o`), `SYNC_WAIT_SECONDS` (300), `BRIEF_LEAD_SECONDS` (one day) and `BRIEF_INSTRUCTIONS`.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `chili-piper`, `hubspot`, `clearbit`, `chatgpt`, `zapier-tables` and `slack` to the user's own connections, one per app in `connections/`. The HubSpot account must be the portal that holds the meeting contacts.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/meeting-created.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `meeting_created`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Chili Piper trigger fields, the HubSpot contact and company search and note actions, the Clearbit lookup, the Zapier Tables `create_record` action and the Slack `channel_message` action with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with a meeting the user books for a test guest they own:

```json
{
  "PersonEmail": "test.guest@example.com",
  "PersonFirstName": "Test",
  "PersonLastName": "Guest",
  "meetingTitle": "Test discovery call",
  "meetingStartTime": "1893456000",
  "meetingLocation": "https://zoom.us/j/0000000000",
  "meetingDescription": "Test meeting for the call prep brief.",
  "hostFullName": "Test Host",
  "assigneeFullName": "Test Host",
  "primaryGuestTimeZone": "UTC",
  "additionalGuests": ""
}
```

Use a start time in the future, so the day-before wait is long. For a faster check, use a start time within a day, so the brief goes out at once. Confirm that a new row appears in the table with the brief, and that the brief reaches the Slack user in a direct message. The user deletes the test row and test message, not the agent.

## Notes

- The Zap sends each brief as a Slack direct message to one user. To send briefs to a whole sales team, change `SLACK_USER_ID` to a channel the team owns and add the team's Slack channel as a second `channel_message` step.
- Briefs are written from the data in HubSpot and Clearbit. Missing fields show as "unknown" and the brief says so.
- Without a matching HubSpot contact, the brief is still saved to the table and sent to Slack, but no HubSpot note is added.
- Never commit a real HubSpot account number, Slack user ID, table ID or guest's email address.
