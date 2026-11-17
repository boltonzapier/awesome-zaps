---
name: track-brand-mentions-sentiment-from-google-alerts
description: Build a Zap on Zapier that watches a Google Alerts RSS feed for your brand, reads each new article, scores its sentiment, saves it as a row in a Zapier Table with its headline, summary, quotes and dates, and posts an alert to a Slack channel. Use when a team wants a running, searchable record of press and news mentions with sentiment and instant team alerts, without reading every article by hand.
license: MIT
metadata:
  author: zapier
  summary: "Each new news mention of your brand is saved to a Zapier Table with its sentiment and quotes, and posted to your team in Slack."
  apps: "RSS, Webhook, AI by Zapier, Zapier Tables, Slack"
  category: "Marketing"
  job: "Brand management"
  source: "https://zapier.com/templates/details/automate-brand-monitoring-news-mentions-tracker"
---

# Brand mention and sentiment tracker: Get insight into when, and how, your brand is mentioned

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/track-brand-mentions-sentiment-from-google-alerts. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new item appears in the Google Alerts RSS feed you set (`rss`, `multi_feed`).
2. **Webhook** fetches the article page behind the alert link.
3. **AI by Zapier** reads the article and returns its headline, a short summary, its sentiment (Positive, Neutral, Negative or Mixed) and any direct quotes about the brand.
4. **Zapier Tables** adds one row to your mentions table with those fields, the article link, its publish date and the time it was logged.
5. **Slack** posts the headline, sentiment, summary, link and quotes to your alerts channel.

Every new feed item gets a row and a Slack post. The Zap never changes or deletes an existing row.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                                    | Where                                                                                                                          | What goes there                                                                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `urls`                                     | `triggers/new-feed-item.ts`                                                                                                    | The Google Alerts RSS feed for the brand: in Google Alerts, open the alert and copy its RSS feed link. Up to 10 URLs.                        |
| `TABLE_ID`                                 | `config.ts`                                                                                                                    | The Zapier Table that stores mentions: take its ID from the table's URL                                                                      |
| `SLACK_CHANNEL_ID`                         | `config.ts`                                                                                                                    | The channel that gets mention alerts: look up its ID (C…) with the user's Slack connection                                                   |
| `HEADLINE_FIELD` and the other column keys | `config.ts` (`SUMMARY_FIELD`, `SENTIMENT_FIELD`, `QUOTES_FIELD`, `ARTICLE_URL_FIELD`, `PUBLISHED_AT_FIELD`, `LOGGED_AT_FIELD`) | The field key of each column in that table: ask which column holds each value, then look up its key with the user's Zapier Tables connection |

Also review the defaults with the user:

- `BOT_NAME`: the name the Slack alerts post under.
- `MODEL_ID`: the AI model tier. `standard/auto` is the default.
- `MAX_ARTICLE_CHARS`: how much of each article the AI reads.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `slack` to the user's Slack connection for the workspace with the alerts channel, `ai` to the user's AI by Zapier connection, and `zapier-tables` to the user's Zapier Tables connection for the table that stores mentions. The RSS and Webhook steps need no account.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-feed-item.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with `rss`, find the row whose `key` is `multi_feed`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the RSS trigger's output fields, the Webhook `custom` action's output, the AI `get_completion` output fields, and the Zapier Tables `create_record` fields with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match, and in particular the column field keys in `config.ts`.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) with a public article the user chooses, not a private one. The table and channel should be test ones the user owns:

```json
{
  "title": "Example Co launches new product line",
  "link": "https://news.example.com/articles/example-co-launch",
  "pubDate": "Mon, 16 Nov 2026 09:00:00 GMT"
}
```

Confirm that one new row appears in the mentions table with the headline, summary, sentiment, article link and dates, and that one message appears in the Slack channel. If run-status tools aren't available, check the table and the channel directly. The user deletes the test row and message, not the agent.

## Notes

- Once published and active, every new item in the feed adds a row and a Slack message. Keep the alert specific to your brand so the channel stays useful.
- The AI reads only the article text it is given, so a page that loads its content with JavaScript may give a thin summary.
- Google Alerts links can redirect before reaching the article. The Webhook step follows the link; if an article resolves to a Google page instead, its row will say so.
- Never commit a real table ID, channel ID, RSS feed URL or column key.
