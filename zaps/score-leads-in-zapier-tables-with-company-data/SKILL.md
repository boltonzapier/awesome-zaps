---
name: score-leads-in-zapier-tables-with-company-data
description: Build a Zap on Zapier that, for each new record in a Zapier Tables lead table, looks up the lead's email with a lead scorer and writes back a score, a grade, the top signals behind it, and company details such as domain, size, location and industry. Use when a sales or marketing team wants new leads enriched and scored in their table before outbound outreach, without doing the research by hand.
license: MIT
metadata:
  author: zapier
  summary: "Each new lead in your Zapier Tables table gets a score, a grade, and company data from its email address, so your sales team knows who to call first."
  apps: "Zapier Tables, Lead Score by Zapier, Formatter by Zapier"
  category: "Sales"
  job: "Lead management"
  source: "https://zapier.com/templates/details/lead-scoring"
---

# Lead Scoring Template

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/score-leads-in-zapier-tables-with-company-data. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new record is added to your lead table (`zapier-tables`, `new_record`).
2. **Lead Score by Zapier** looks up the record's email address and returns the person's fit segment, score, top signals and whether they are a student, plus their company's domain, name, industry, employee count and location.
3. **Formatter by Zapier** swaps the scorer's `:star:` grade for a star emoji.
4. **Zapier Tables** writes all of it back to the same record.

Records with no email, or with an email the scorer has no data on, are left as they were. The Zap only writes to the record it was triggered by.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own Zapier Tables connection; don't ask them to paste an ID you can look up.

| Setting                                                                                                                                                                                                                                                               | What goes there                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `table_id` (trigger) and `TABLE_ID` (`config.ts`)                                                                                                                                                                                                                     | The lead table. Ask which table it is, then look up its ID with the user's Zapier Tables connection. Both take the same value.                                                                     |
| `EMAIL_FIELD`                                                                                                                                                                                                                                                         | The column holding the email address to score.                                                                                                                                                     |
| `COMPANY_DOMAIN_FIELD`, `IS_STUDENT_FIELD`, `SEGMENT_FIELD`, `SCORE_FIELD`, `TOP_SIGNALS_FIELD`, `GRADE_FIELD`, `COMPANY_NAME_FIELD`, `COMPANY_STATE_FIELD`, `COMPANY_STATE_CODE_FIELD`, `COMPANY_COUNTRY_FIELD`, `COMPANY_EMPLOYEES_FIELD`, `COMPANY_INDUSTRY_FIELD` | The columns that receive each value. Map each to the user's column. Look up each field key with the Zapier Tables connection; a column the user doesn't want can point at a column they don't use. |

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files.

1. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection for the account that owns the lead table. Lead Score by Zapier and Formatter by Zapier need no connection of their own.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-record.ts` and `connections/zapier-tables.ts` are settings: set the workflow's trigger and connection from them.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** before the first test run, check the trigger's fields and each `update_record` field key with the user's Zapier Tables connection, and fix any key in `config.ts` that doesn't match.

## Test it

Lead Score by Zapier allows 500 lookups a month, so test with one record only. Create the test record yourself in the lead table with a test address the user owns, then run this sample as a draft test (`run_workflow_draft` in Zapier MCP). Replace the field key with the user's `EMAIL_FIELD` value:

```json
{
  "record_id": "rec_test",
  "new": {
    "data": {
      "<EMAIL_FIELD>": "test@example.com"
    }
  }
}
```

Confirm that the record gained a score, a grade and company details. If run-status tools aren't available, check the record in Zapier Tables directly. The user deletes the test record, not the agent.

## Notes

- Each new record costs one lead lookup. Lead Score by Zapier's free allowance is 500 a month; past that, the scorer's own MadKudu integration on Zapier is needed.
- Records are scored once, when they are added. Edits to an existing record don't trigger the Zap.
- The grade column shows stars because the scorer's grade uses `:star:` codes and Formatter swaps them for the emoji.
- Never commit a real table ID, field key or email address.
