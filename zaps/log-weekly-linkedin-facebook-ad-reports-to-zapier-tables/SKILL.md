---
name: log-weekly-linkedin-facebook-ad-reports-to-zapier-tables
description: Build a Zap on Zapier that pulls the last seven days of LinkedIn Ads campaign performance and Facebook ad statistics every week and writes them as rows in a Zapier Tables ad report, with impressions, clicks, CTR, leads, cost per lead and spend. Use when a marketing team wants one weekly table comparing LinkedIn and Facebook ad results without copying reports by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every week, your LinkedIn and Facebook ad results are added to one Zapier Tables report, ready for a weekly summary."
  apps: "Schedule by Zapier, LinkedIn Ads, Facebook Lead Ads, Zapier Tables"
  category: "Marketing"
  job: "Marketing analytics"
  source: "https://zapier.com/templates/details/ai-agent-marketing-campaign-tracker"
---

# AI Agent Marketing Campaign Tracker

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-weekly-linkedin-facebook-ad-reports-to-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** every week on Wednesday at 7:00 AM Pacific (`schedule`, `everyWeek`).
2. **LinkedIn Ads** pulls the campaign report for the last seven days: spend, clicks, impressions and action clicks, one row per campaign.
3. **Facebook Lead Ads** pulls ad statistics for the same business.
4. **Zapier Tables** adds one row per LinkedIn campaign and one row per Facebook ad to the ad report table, with the platform, CTR, leads, cost per lead, spend and the report date.

The Zap only reads from the ad platforms and writes to the table. It never changes a campaign, an ad or a budget.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                  | Where       | What goes there                                                                                      |
| ------------------------ | ----------- | ---------------------------------------------------------------------------------------------------- |
| `LINKEDIN_AD_ACCOUNT_ID` | `config.ts` | The LinkedIn ad account to report on: look up its numeric ID with the user's LinkedIn Ads connection |
| `TABLE_ID`               | `config.ts` | The Zapier Tables table that holds the ad report: pick it from the user's tables                     |

Also check the defaults with the user:

- `FIELD_*` in `config.ts`: the table's field keys (`f1` to `f13`), one per column of the ad report. Map them to the table's columns before the first run, or the rows land in the wrong columns.
- `REPORT_START` and `REPORT_END`: the report window, `today-7d` to `now` by default.
- `triggers/every-week.ts`: the day, time and timezone. `dow` counts from 0 for Monday, so `"2"` is Wednesday.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `linkedin-ads` to the user's LinkedIn Ads connection for the ad account, `facebook-lead-ads` to their Facebook Lead Ads connection for the business, and `zapier-tables` to their Zapier Tables connection for the account that owns the table.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/every-week.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `everyWeek`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the LinkedIn `report` action, the Facebook `report_adstatistics` action and the Tables `create_record` action with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match, and check the `f<number>` keys in `config.ts` against the table's fields.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a test table the user owns, not the live ad report table. The trigger carries no input, so an empty object is enough:

```json
{}
```

Confirm that one row per LinkedIn campaign and per Facebook ad appears in the test table, with the platform, the figures and the report date. If run-status tools aren't available, check the table directly. The user deletes the test rows, not the agent.

## Notes

- The Zap is weekly, so a published Zap adds a new set of rows every week. Each run appends rows; it doesn't replace earlier ones.
- The template's Zapier Agent step, which writes the weekly summary and recommendations, is not part of this Zap. Build it as a separate Zapier Agent that reads the ad report table.
- Cost per click and cost per acquisition are formula columns in the template's table. Add them as formulas in the user's table rather than writing them from the Zap.
- Never commit a real LinkedIn ad account ID, a real table ID or a real Facebook page ID.
