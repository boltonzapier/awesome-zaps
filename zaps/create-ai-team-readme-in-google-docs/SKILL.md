---
name: create-ai-team-readme-in-google-docs
description: Build a Zap on Zapier that turns each new survey answer about how someone works into a personal ReadMe in Google Docs, written by AI in their own voice, shared with them in Slack, and sent to their manager a few business days later. Use when a team wants every new hire or team member to get a working-style ReadMe without writing one from scratch.
license: MIT
metadata:
  author: zapier
  summary: "Each new survey answer becomes a ReadMe in Google Docs, written in the employee's voice and shared with them in Slack, with a note to their manager three business days later."
  apps: "Slack, BambooHR, Google Docs, Google Drive, Zapier Tables, AI by Zapier"
  category: "Human Resources (HR)"
  job: "HR operations"
  source: "https://zapier.com/templates/details/team-cohesion-ai-team-readme-creator"
---

# Team cohesion: AI Team ReadMe creator

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/create-ai-team-readme-in-google-docs. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new row is added to the survey table in Zapier Tables (`zapier-tables`, `new_record`). Each row is one employee's answers.
2. **BambooHR** finds the employee by email and reads their name and manager's email (`bamboohr`).
3. **Slack** finds the employee and their manager by email, and reads the employee's most relevant recent message as a writing sample (`slack`).
4. **AI by Zapier** writes seven short ReadMe sections from the answers and the writing sample (`ai`): a summary, social connections, working relationships, how they structure their time, communication, how they structure work, and how to give them feedback.
5. **Google Docs** copies the `[template] Readme` document, fills it in, and names it after the employee (`google-docs`).
6. **Zapier Tables** saves the summary and writing sample back to the survey row (`zapier-tables`).
7. **Google Drive** gives the employee edit access to their ReadMe (`google-drive`).
8. **Slack** DMs the employee the link and next steps.
9. **Slack** schedules a message to the employee's manager for three business days later, with the link (`slack`).

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting           | Where                                                   | What goes there                                                                                                                                                                                                |
| ----------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TABLE_ID`        | `config.ts`, and `table_id` in `triggers/new-record.ts` | The Zapier Tables table that holds the survey answers. Look up its ID with the user's `zapier-tables` connection. Use the same value in both places.                                                           |
| `DRIVE_FOLDER_ID` | `config.ts`                                             | The Google Drive folder the ReadMes are created in. Look up its ID (the long ID in the folder's URL) with the user's `google-drive` connection.                                                                |
| `ORG_DOMAIN`      | `config.ts`                                             | The organization's email domain, for example the part after the @ in a work address.                                                                                                                           |
| Column keys       | `config.ts`                                             | One `*_COLUMN` value per survey question, such as `THOUGHT_COLUMN` or `SUMMARY_COLUMN`. Ask the user which table column holds each answer, then look up each column's key with the `zapier-tables` connection. |

Also review the defaults with the user:

- `TEMPLATE_TITLE`: the title of the ReadMe template document in their Google Drive. The default is `[template] Readme`.
- `AI_MODEL`: the model that writes the sections. The default is `openai/gpt-4o-mini`.
- `MANAGER_DM_DELAY_BUSINESS_DAYS`: how many business days after the draft the manager hears about it. The default is 3.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection, `bamboohr` to their BambooHR connection, `slack` to their Slack connection for the workspace, `google-docs` and `google-drive` to their Google connections for the account that owns the template and the ReadMe folder, and `ai` to their AI by Zapier connection.
2. **Source:** publish `workflow.ts`, `config.ts` and `lib/` (`lib/business-days.ts` and `lib/readme-prompts.ts`), with each `REPLACE_…` replaced by the user's answer. `triggers/new-record.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_record`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Zapier Tables trigger's fields, the BambooHR `employeeSearch` action, the Slack `user_by_email` and `message` searches and `direct_message` and `channel_message` actions, the Google Docs `document` search and `create_from_template` action, and the Google Drive share action, with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match. The Google Docs template placeholders (`template_field__…`) must match the placeholders in the user's template document.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a test row in a test table the user owns. Replace each column key with the user's own:

```json
{
  "record_id": "rec_test_0001",
  "new": {
    "data": {
      "<EMAIL_COLUMN>": "test.user@example.com",
      "<THOUGHT_COLUMN>": "I like to plan my week on Monday.",
      "<SCHEDULE_COLUMN>": "Mornings for deep work",
      "<SUMMARY_COLUMN>": ""
    }
  }
}
```

Confirm that one ReadMe appeared in the folder with the employee's name, that the survey row's summary and writing sample were filled in, that the test employee got the Slack DM with the link, and that a message to the manager is scheduled. The user deletes the test document and the test row, not the agent.

## Notes

- The ReadMe is an editable draft. The employee is meant to revise it, so the Zap shares it with edit access and doesn't lock it.
- The manager's message is scheduled at the same time of day, three business days after the Zap ran. Weekends are skipped; public holidays are not.
- The writing sample is the most recent Slack message the employee sent that matches the search. If the employee has no messages yet, the sections are written from the survey alone.
- The Zap doesn't send the ReadMe to anyone outside the employee and their manager. Keep the ReadMe folder shared only with the team that should see it.
- Never commit a real spreadsheet, table, folder or domain ID, or an employee's email or answers.
