---
name: notify-slack-on-employee-offboarding-from-google-forms
description: Build a Zap on Zapier that starts from one resignation or termination form submission, looks the employee up in BambooHR, logs a row in a Zapier Table, and posts a voluntary or involuntary offboarding notice to payroll, IT, accounting, total rewards and tax in Slack. Use when HR wants one form to start offboarding and tell every team that needs to act.
license: MIT
metadata:
  author: zapier
  summary: "One resignation or termination form submission looks up the employee in BambooHR, logs the separation in a table, and notifies payroll, IT, accounting, total rewards and tax in Slack."
  apps: "Google Forms, BambooHR, Zapier Tables, Slack"
  category: "Human Resources (HR)"
  job: "HR operations"
  source: "https://zapier.com/templates/details/employee-offboarding"
---

# Employee offboarding

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/notify-slack-on-employee-offboarding-from-google-forms. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new response to the resignations and terminations form (`google-forms`, `new_form_response`).
2. **BambooHR** finds the employee by company email to fill in department, location, hire date, employee number and ID.
3. **Zapier Tables** adds one row to the terminations table with the answers from the form.
4. **Workflow** works out tenure in years from hire date to last day, truncated to one decimal, and picks the notice set for a voluntary or involuntary termination.
5. **Slack** posts each team's notice: payroll, IT, accounting and total rewards go to private channels, and tax goes to a public channel. Payroll's notice mentions the employee's People Business Partner.

Each form submission produces one set of notices. The Zap doesn't change anything in BambooHR, and it doesn't send email or grant or remove access.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                                                                                                                                  | Where                                                         | What goes there                                                                                                                                                  |
| ---------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `formId`                                                                                                                                 | `triggers/new-form-response.ts`, and `FORM_ID` in `config.ts` | The resignations and terminations form: look up its ID (the long ID in its URL) with the user's Google Forms connection                                          |
| `TERMINATIONS_TABLE_ID`                                                                                                                  | `config.ts`                                                   | The Zapier Table that holds terminations: look up its ID with the user's Zapier Tables connection                                                                |
| `COL_FULL_NAME`, `COL_LAST_DAY`, `COL_COMPANY_EMAIL`, `COL_PERSONAL_EMAIL`, `COL_TERM_TYPE`, `COL_JOB_LEVEL`, `COL_REASON`, `COL_REHIRE` | `config.ts`                                                   | The key of each matching column in that table, read from the table's own column list; ask the user to create the table with these columns first if it lacks them |
| `PAYROLL_CHANNEL_ID`, `IT_CHANNEL_ID`, `ACCOUNTING_CHANNEL_ID`, `TOTAL_REWARDS_CHANNEL_ID`                                               | `config.ts`                                                   | The private Slack channel each team reads: look up each ID (G… or C…) with the user's Slack connection                                                           |
| `TAX_CHANNEL_ID`                                                                                                                         | `config.ts`                                                   | The public Slack channel tax reads: look up its ID (C…) with the user's Slack connection                                                                         |
| `PBP_SLACK_USER_ID`                                                                                                                      | `config.ts`                                                   | The Slack user of the People Business Partner who is mentioned in payroll notices: look up their user ID (U…) with the user's Slack connection                   |

Use one answer for each setting, even where it appears in two files, so the trigger and `config.ts` can't disagree.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-forms` to the connection for the account that owns the form, `bamboohr` to the company BambooHR connection, `zapier-tables` to the account that owns the terminations table, and `slack` to the workspace with the team channels. Each is described in `connections/`.
2. **Source:** publish `workflow.ts`, `config.ts`, `lib/tenure.ts` and `lib/notifications.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-form-response.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_form_response`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Google Forms trigger's fields, the BambooHR `employeeSearch` action's fields, the Zapier Tables `create_record` action's fields, and the Slack `channel_message` and `private_channel_message` actions' fields with the user's connections before the first run. Fix any key in `workflow.ts` that doesn't match, especially the form question IDs and the table column keys.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) only after the user agrees to name the test accounts and channels. Use a test channel the user owns and a test table row the user deletes afterward:

```json
{
  "createTime": "2026-01-15T09:00:00Z",
  "65986356": "test.employee@example.com",
  "6f464119": "Test Employee",
  "35d27a95": "2026-02-15",
  "5a79443a": "test.personal@example.com",
  "57c8e978": "3",
  "42c34030": "Voluntary",
  "35cda77c": "No",
  "29a30e0d": "Relocating",
  "1fb110a1": "Yes"
}
```

Confirm that one row appears in the terminations table, and that each of the five Slack notices arrives in its channel with the employee's name, last day and tenure. If run-status tools aren't available, check the table and the channels directly. The user removes the test row and test messages, not the agent.

## Notes

- Tenure is computed from hire date to last day, truncated to one decimal (3.96 years reads as 3.9), so a notice never overstates how long someone stayed.
- The involuntary path adds an access removal date, severance expectation and notice weeks from the form. The voluntary path leaves them out.
- Not included, because they need their own tables or a second form: separation agreement drafting and signing, severance payment tracking, exit survey pre-population, the farewell post flow, offboarding guide reminders and BambooHR uploads. The Zap covers the one submission that starts offboarding and the notices that follow from it.
- Notices copy the form's answers and BambooHR data into Slack channels. Give the channels only to people who should see personal details such as personal email addresses.
- Never commit a real form ID, table ID, channel ID, Slack user ID or any employee's details.
