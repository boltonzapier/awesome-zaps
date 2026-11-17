---
name: log-facebook-leads-with-ai-in-sheets
description: Build a Zap on Zapier that takes each new Facebook Lead Ads submission, uses AI by Zapier to split the name and flag whether it reads as a person or a business, and logs the lead as a row in a Google Sheets tracker. Use when a team collects leads through Facebook lead forms and wants them in a sheet, already sorted by name, without retyping.
license: MIT
metadata:
  author: zapier
  summary: "Each new Facebook lead is logged to your Google Sheet with its details, plus the first and last name and a person-or-business flag that AI reads from the name."
  apps: "Facebook Lead Ads, AI by Zapier, Google Sheets"
  category: "Sales"
  job: "Lead management"
  source: "https://zapier.com/templates/details/9e150c2e3e12f55c123272cc2b8450d4fe544e95258f17af3069c91d8ba69402"
---

# Log Facebook leads with AI in Sheets

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-facebook-leads-with-ai-in-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a person submits a lead form on a Facebook Page (`facebook-lead-ads`, `lead`).
2. **AI by Zapier** (`get_completion`) reads the submitter's full name and returns the first name, last name, a `name_type` of `person`, `business` or `unclear`, and a one-sentence note explaining that call. It never invents a name.
3. **Google Sheets** adds one row with the lead ID, the submission time, the full name, email, phone, and the four values from the AI step.

The Zap writes one row per lead and never edits or deletes existing rows.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                    | Where                      | What goes there                                                                                                                                 |
| -------------------------- | -------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `REPLACE_FACEBOOK_PAGE_ID` | `triggers/lead.ts`, `page` | The Facebook Page whose lead forms start the Zap: ask which Page it is, then look up its ID with the user's Facebook Lead Ads connection        |
| `SPREADSHEET_ID`           | `config.ts`                | The sheet that collects the leads: ask which sheet it is, then look up its ID (the long ID in its URL) with the user's Google Sheets connection |

Also review the defaults with them:

- The trigger listens to any form on the Page. To start it from one form only, add a `form` param in `triggers/lead.ts` with that form's ID.
- `WORKSHEET_ID`: the tab holding the leads. `"0"` is the first tab.
- `COLUMN_*` values in `config.ts`: column keys such as `COL$A`, not header names. Map the user's headers to their column letters, one for each value the Zap writes.
- `MODEL_ID`: `standard/auto` by default. Change it only if they want a stronger model.

Before turning it on, sample a lead with the Facebook Lead Ads connection and confirm the keys `FULL_NAME`, `EMAIL` and `PHONE_NUMBER` exist. Facebook's standard questions arrive in uppercase; custom questions use the key the form defines, so rename the keys in `workflow.ts` to match.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `facebook-lead-ads` to the user's Facebook Lead Ads connection for the Page, and `google-sheets` to the user's Google Sheets connection for the account that owns the lead sheet. AI by Zapier needs no connection; it uses Zapier-managed credentials (`authentication_id` `"0"`).
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/lead.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect each action's fields with the user's connections (and sample the trigger) before the first test run. Fix any key in `workflow.ts` that doesn't match, including the `COL$` keys and the AI step's `outputFields`.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with a test lead the user sets up for this, not a real one:

```json
{
  "id": "install-test-lead-0001",
  "created_time": "2026-10-29T10:15:00+0000",
  "FULL_NAME": "[install-test] Jordan Rivera",
  "EMAIL": "install-test+lead@example.com",
  "PHONE_NUMBER": "+1 (555) 010-2030"
}
```

Confirm one new row in the sheet with the lead ID, the timestamp, the name and contact fields, `Jordan` and `Rivera` in the name columns, and `person` in the name-type column with a short note. If run-status tools aren't available, check the result in Google Sheets directly. The user deletes the test row, not the agent.

## Notes

- The AI step only reads the name. It doesn't see the email or phone, so the name-type flag is a guess from the name alone. Review the flag on a few rows before relying on it.
- Each lead adds a row, so a lead that is submitted twice adds two rows. Add a lookup step before the row write if duplicates matter.
- Google Sheets may show the timestamp in the sheet's own format and time zone.
- Never commit a real spreadsheet ID.
- To notify the team of each lead, add a Slack or email step after the row write.
