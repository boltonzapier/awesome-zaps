---
name: tag-customer-feedback-themes-in-notion-with-chatgpt
description: Build a Zap on Zapier that reads each new item in a Notion database of customer feedback, has ChatGPT tag the themes it raises, and writes those tags back to the item. Use when a product or support team collects feedback in Notion and wants each entry tagged by theme for analysis.
license: MIT
metadata:
  author: zapier
  summary: "Each new customer feedback item in your Notion database is tagged with the themes it raises, using ChatGPT, so you can filter and count feedback by theme."
  apps: "Notion, ChatGPT (OpenAI)"
  category: "Product"
  job: "Product feedback management"
  source: "https://zapier.com/templates/details/6e6d3c840f4c87cc4b776d6d32b675c247849562b595d24ad4adb96ba0eaa23f"
---

# Categorize customer feedback in Notion with theme tags using ChatGPT

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/tag-customer-feedback-themes-in-notion-with-chatgpt. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new item is created in the feedback database (`notion`, `new_data_source_item`).
2. **ChatGPT** reads the item's feedback text and picks up to three themes from a fixed list, such as Pricing, Bugs or Feature request.
3. **Notion** writes those themes to the item's `Theme tags` multi-select property. Items with no matching theme are left unchanged.

The Zap only writes theme tags. It never edits the feedback text or any other property.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                 | Where                                                               | What goes there                                                                                                                                                  |
| ----------------------- | ------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NOTION_DATA_SOURCE_ID` | `config.ts`, and `datasource` in `triggers/new-data-source-item.ts` | The feedback database: look up its data source ID with the user's Notion connection (not the database ID from the page URL). Use the same value in both places.  |
| `FEEDBACK_PROPERTY`     | `config.ts`                                                         | The property that holds the feedback text, as its key in the form `properties\|\|\|<Property name>\|\|\|<type>`. Ask which property it is, then look up its key. |

Also review with the user:

- `THEME_PROPERTY`: a multi-select property named `Theme tags` in that database, with the options in `THEME_OPTIONS`. Create it, or change the name here to match theirs.
- `THEME_OPTIONS`: the themes the zap may write. Edit the list to suit their product.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `notion` to the user's Notion connection for the workspace that has the feedback database, and `chatgpt` to the user's ChatGPT (OpenAI) connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-data-source-item.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `new_data_source_item`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields and the Notion `update_database_item` and ChatGPT `conversation_responses_api` actions with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match, especially the property keys for the feedback text and the theme tags.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a test item the user creates in a test database:

```json
{
  "id": "test-item-1",
  "properties|||Feedback|||rich_text": "[install-test] The export button is hard to find and the CSV is missing the date column."
}
```

Confirm that the test item gets a `Theme tags` value such as Usability or Bugs, and nothing else changes. If run-status tools aren't available, check the item in Notion directly. The user deletes the test item, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every new item in the database gets tagged. ChatGPT's choice is a first pass; the team can correct tags by hand.
- The theme list is fixed in `config.ts` so tags stay consistent across items. Change it there, not in the prompt.
- Never commit a real Notion data source ID or a real feedback sample.
