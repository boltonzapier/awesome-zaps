---
name: draft-ai-hiring-material-in-google-docs-and-slack
description: Build a Zap on Zapier that drafts job description sections, application questions and interview questions with AI from each new row in a hiring materials table, creates a Google Doc from a template, opens a Slack channel for the hiring team and records both links in the table. Use when a team wants first-draft hiring material for each new role without writing it by hand.
license: MIT
metadata:
  author: zapier
  summary: "Each new hiring row gets AI-drafted job description and interview material in a Google Doc, plus a Slack channel for the hiring team, with both links saved back to the table."
  apps: "Zapier Tables, AI by Zapier, Google Docs, Slack"
  category: "Human Resources (HR)"
  job: "Recruiting"
  source: "https://zapier.com/templates/details/ai-powered-hiring-material"
---

# AI-powered hiring material

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/draft-ai-hiring-material-in-google-docs-and-slack. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new record is added to the hiring materials table (`zapier-tables`, `new_record`).
2. **Zapier Tables** reads the record's intake fields.
3. **AI by Zapier** drafts the about-this-role and about-you sections, the things the hire will do, five application questions, and interview questions by stage (recruiter screen, hiring manager, skills).
4. **Zapier Tables** saves the drafts back to the record.
5. **Google Docs** creates a doc from the hiring material template, filled with the record and the drafts.
6. **Slack** creates a channel named for the role and half-year, invites the recruiter and hiring manager, and posts the doc link.
7. **Zapier Tables** saves the channel name and doc link to the record.

Every new record gets its own doc and channel. The drafts are first drafts: the hiring team reviews them before use.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                                                                                                                                                                        | Where                                                   | What goes there                                                                                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TABLE_ID`                                                                                                                                                                     | `config.ts`, and `table_id` in `triggers/new-record.ts` | The hiring materials table, looked up with the user's Zapier Tables connection                                                                                         |
| `TEMPLATE_DOC_ID`                                                                                                                                                              | `config.ts`                                             | The hiring material Google Doc template, looked up with the user's Google Docs connection. It must use the placeholder names in `TEMPLATE_FIELDS`                      |
| Field keys: `DEPARTMENT_FIELD`, `ROLE_TITLE_FIELD`, `ROLE_LEVEL_FIELD`, `LOCATION_FIELD`, `HIRING_MANAGER_EMAIL_FIELD`, `RECRUITER_EMAIL_FIELD`, `INTAKE_NOTES_FIELD`          | `config.ts`                                             | The intake columns the drafts are written from. The intake notes column holds the hiring manager's answers on skills, team gaps, projects and why the role is exciting |
| Field keys: `ABOUT_ROLE_FIELD`, `ABOUT_YOU_FIELD`, `THINGS_YOULL_DO_FIELD`, `APPLICATION_QUESTIONS_FIELD`, `INTERVIEW_QUESTIONS_FIELD`, `CHANNEL_FIELD`, `DOCUMENT_LINK_FIELD` | `config.ts`                                             | The columns the zap writes drafts, the channel name and the doc link to. Look each up with the user's Zapier Tables connection                                         |

Also review the defaults with them:

- `FOLDER_ID`: where the docs are created. `"root"` is the user's My Drive.
- `SHARING_PREFERENCE`: how the doc is shared. `"commenter"` lets reviewers comment without editing.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection for the account that owns the tracker, `google-docs` to the connection that owns the template and the output folder, and `slack` to the connection for the workspace where channels are created. The Slack account must be allowed to create channels and invite members.
2. **Source:** publish `workflow.ts`, `config.ts` and `lib/channel-name.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-record.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_record`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the `find_record` and `update_record` actions for Zapier Tables, the `create_from_template` action for Google Docs, and the Slack `new_channel`, `user_by_email`, `channels_invite_v2` and `channel_message` actions with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match.
5. **Template doc:** check that the template doc has every placeholder listed in `TEMPLATE_FIELDS` in `config.ts`, spelled the same way.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) on a test row the user adds to the tracker for this, not a real role:

```json
{
  "record_id": "rec_test_0001"
}
```

Confirm that the test row gets drafts in its draft columns, that one doc appears in the output folder with the drafts filled in, that a Slack channel named for the role and half-year exists, and that the row shows the channel name and doc link. The user deletes the test doc, the test channel and the test row, not the agent.

## Notes

- Every new row creates a doc and a channel. Keep the tracker to real open roles, or delete test rows promptly.
- The drafts come from the intake notes only. They are first drafts: review the job description, application questions and interview questions before they are shared with candidates.
- The channel name uses the role title and the half-year of the row's creation date. Slack channel names can't repeat, so a second role with the same title in the same half-year fails at channel creation and needs a new name.
- Never commit a real table ID, doc ID, Slack channel ID or email address.
