---
name: generate-content-ideas-with-chatgpt-in-zapier-tables
description: Build a Zap on Zapier that takes each new content idea added to a Zapier Tables table, asks ChatGPT for five related ideas from different angles, and saves them back to the table as drafts. Use when a marketing team wants one idea to grow into a list of blog, social, video, newsletter or email ideas without a blank page.
license: MIT
metadata:
  author: zapier
  summary: "Each new idea in your Zapier Table gets five related ideas from ChatGPT, saved back to the table as drafts for review."
  apps: "ChatGPT (OpenAI), Zapier Tables"
  category: "Marketing"
  job: "Content media production"
  source: "https://zapier.com/templates/details/ai-content-idea-generator"
---

# AI Content Idea Generator Template

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/generate-content-ideas-with-chatgpt-in-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new record is added to your ideas table (`zapier-tables`, `new_record`).
2. **Workflow** skips records marked AI-generated, so the ideas it saves don't generate more ideas, and records with no title.
3. **ChatGPT** receives the idea's title, details and type of content, and returns five related ideas as JSON, each with a title and details of the same type of content.
4. **Zapier Tables** adds those five ideas to the same table as new records, marked AI-generated with the status Draft.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting    | Where                                                   | What goes there                                                                                                                    |
| ---------- | ------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `TABLE_ID` | `config.ts`, and `table_id` in `triggers/new-record.ts` | The ideas table: ask which table holds the ideas, then look up its ID with the user's Zapier Tables connection (the ID in its URL) |

Use the same table ID in both places, or the trigger and the saved ideas will point at different tables.

The table needs five columns in this order: Title, Details, Type of content, AI-generated (checkbox), Status. The field keys in `config.ts` (`f1` to `f5`) are the keys of the template's Ideas table. A table the user builds from scratch has different keys, and each one must be matched before the first run.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection for the account that holds the ideas table, and `chatgpt` to the user's ChatGPT (OpenAI) connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-record.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Zapier Tables `new_record` trigger's fields and the `create_record` action's fields with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match. Check that the trigger's input carries the record's Title, Details, Type of content label, AI-generated and Status values under the names the workflow reads.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), against a test ideas table the user owns:

```json
{
  "record_id": "rec_test_0001",
  "new": {
    "data": {
      "f1": "Test idea: how a small team uses AI for content",
      "f2": "A test idea for checking the Zap. Delete it after the run.",
      "f3": "blog_post",
      "f3__label": "Blog post",
      "f4": false,
      "f5": "Draft"
    }
  }
}
```

Confirm that five new records appear in the test table, each marked AI-generated with the status Draft and a type of content of Blog post, and that the test idea itself is unchanged. The user deletes the test records, not the agent. The ChatGPT step checks every 30 seconds for up to ten minutes, so the run can take a few minutes.

## Notes

- Every new record in the table starts a run, so keep the table to the ideas the team wants expanded. Records added by this Zap are skipped.
- The model is set in `config.ts` (`DEFAULT_MODEL`). Change it there if the user's ChatGPT account has a different model available.
- Never commit a real table ID.
