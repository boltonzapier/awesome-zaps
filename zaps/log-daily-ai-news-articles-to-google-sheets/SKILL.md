---
name: log-daily-ai-news-articles-to-google-sheets
description: Build a Zap on Zapier that runs every evening, has AI search the news for yesterday's AI brand and product coverage, and adds one row per article to a Google Sheets tracker with its date, title, link, a clickbait headline and a skimmable summary. Use when a team wants a daily log of AI news in a sheet without searching for it by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every evening AI searches the news for yesterday's AI brands and launches and adds each article to your sheet with a headline, link and summary."
  apps: "AI by Zapier, Google Sheets, Schedule by Zapier"
  category: "Marketing"
  job: "News content feeds"
  source: "https://zapier.com/templates/details/daily-ai-news-tracker-c7a529"
---

# Daily AI News Tracker

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/log-daily-ai-news-articles-to-google-sheets. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** every evening at 8:00 PM in the account's timezone, every day of the week (`schedule`, `everyDay`).
2. **AI by Zapier** searches the public web for AI-related news and product launches published the previous day, from reputable and AI-focused sources. It reads each article and returns its date, title, link, a clickbait headline and a summary.
3. **Google Sheets** adds one row per article to the tracker worksheet, in the columns the user maps. If the search finds nothing, the Zap adds no rows.

The Zap only writes to the sheet. It doesn't post, email or change anything else.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting          | Where       | What goes there                                                                                                                            |
| ---------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `SPREADSHEET_ID` | `config.ts` | The sheet that logs the news: ask which sheet it is, then look up its ID (the long ID in its URL) with the user's Google Sheets connection |

Also review the defaults with them:

- `WORKSHEET_ID`: the tab that holds the log. `"0"` is the first tab, and it needs column headers.
- `DATE_COLUMN`, `TITLE_COLUMN`, `LINK_COLUMN`, `HEADLINE_COLUMN`, `SUMMARY_COLUMN`: column keys such as `COL$A`, not header names. Map the user's headers to their column letters.
- The trigger time in `triggers/every-day.ts` (`hod`, `8:00 PM` by default). Change it if the user wants the log ready at another time.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-sheets` to the user's Google Sheets connection for the account that owns the log sheet. The AI step and the schedule need no connection; AI by Zapier uses Zapier-managed credentials (`authentication_id: "0"`).
2. **Source:** publish `workflow.ts`, `config.ts` and `lib/article-id.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/every-day.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with `schedule`, find the row whose `key` is `everyDay`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow. For the AI step, `get_zapier_skill("zapier:ai-by-zapier")` covers the `tools` shape used in `workflow.ts`: `web_search`, `web_scrape` and `fail`, with the `premium/auto` model.
4. **Fields:** inspect the `add_row` action's fields with the user's Google Sheets connection before the first test run, and fix any column key in `config.ts` that doesn't match. Confirm the AI step returns its articles as a list (`result.items`) and fix `SearchResultSchema` in `workflow.ts` if the shape differs.

## Test it

Run the draft (`run_workflow_draft` in Zapier MCP) with an empty sample input, `{}`, into a test sheet the user owns. The search covers the previous day, so a quiet day can return no rows; if so, rerun once on a day with AI news.

Confirm that one row appears per article, with the date in DAY/MONTH/YEAR, the title, the link, the headline and the summary. The user deletes the test rows, not the agent.

## Notes

- Articles are only as current as the search. The AI is asked for yesterday's news; the sheet can contain duplicates if the same story is found on two days, so review the log periodically.
- Each row's step is named from a hash of its link, so a re-run of the same run doesn't log the same article twice.
- Never commit a real spreadsheet ID.
