---
name: create-daily-viral-content-to-google-docs-and-slack
description: Build a Zap on Zapier that runs every morning, has AI draft a day's viral video package for a niche (a topic, a 5-second hook, short and long video scripts, captions, a newsletter post and an engagement plan), saves it as a Google Doc, shares the doc, and sends the link by Slack. Use when a creator or marketing team wants a fresh set of video scripts ready each day without writing them by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every morning AI drafts a viral video package for your niche, saves it as a Google Doc, shares it, and sends you the link on Slack."
  apps: "AI by Zapier, Google Docs, Google Drive, Schedule by Zapier, Slack"
  category: "Marketing"
  job: "Content marketing"
  source: "https://zapier.com/templates/details/viral-content-creation-agent"
---

# Viral Content Creation Agent

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/create-daily-viral-content-to-google-docs-and-slack. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** every day at 8:00 AM in the account's timezone, on weekends too (`schedule`, `everyDay`).
2. **AI by Zapier** drafts one document for the niche: three trending topics judged for short and long video, the strongest one chosen, a 5-second hook, an 80-second short script, a 5-minute long script with b-roll and filming notes, a caption and up to six hashtags per video, a two-paragraph newsletter post, and an engagement keyword with three reply templates and a daily posting SOP.
3. **Google Docs** creates a document titled `Viral content` plus the run's date, with that text in it.
4. **Google Drive** adds the sharing preference the user chose to the document. It keeps any sharing that already exists.
5. **Slack** sends the user a direct message with the document link.

The Zap only creates and shares documents and sends that one message. It does not post anything publicly or reply to comments.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting              | Where       | What goes there                                                                                               |
| -------------------- | ----------- | ------------------------------------------------------------------------------------------------------------- |
| `BUSINESS_NICHE`     | `config.ts` | The niche the videos cover, in a few words, for example "home coffee brewing". The AI looks for trends in it. |
| `SLACK_RECIPIENT_ID` | `config.ts` | The Slack user who gets the daily link: look up their user ID (U…) with the user's Slack connection.          |
| `SHARING_PREFERENCE` | `config.ts` | Who can open the document. Pick one key from the list below.                                                  |

Sharing keys (`permission` in Google Drive's Add File Sharing Preference):

- `org_link_view`: anyone at the organization with the link can view (recommended default)
- `org_link_comment`: anyone at the organization with the link can comment
- `org_link_edit`: anyone at the organization with the link can edit
- `org_discoverable`: anyone at the organization can find and view
- `public_link_view`: anyone on the internet with the link can view
- `public_link_comment`: anyone on the internet with the link can view and comment
- `public_link_edit`: anyone on the internet with the link can edit
- `public_discoverable`: anyone on the internet can find and view

Only use a `public_` key when the user says so. The `org_` keys need a Google Workspace organization account.

Also review the defaults with them: the 8:00 AM time in `triggers/every-day.ts` (`hod`), and `MODEL_ID` in `config.ts`.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-docs` and `google-drive` to the same user's Google connection (the one that owns the documents), and `slack` to the user's Slack connection for the workspace of the recipient. The AI step uses Zapier-managed credentials (`authentication_id` `"0"`), so it needs no connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/every-day.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with `schedule`, find the row whose `key` is `everyDay`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the `get_completion` action of AI by Zapier, the `newtxtdocument` action of Google Docs, the `share_file` action of Google Drive and the `channel_message` action of Slack with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match. The Google Docs and Slack keys above have not been checked against a live connection.

## Test it

Build-only by default: don't run this Zap in the user's account unless they ask. If they do, run it once as a draft test (`run_workflow_draft` in Zapier MCP) with this sample. The test creates a real document and sends a real Slack message, so tell them that first.

```json
{}
```

Confirm that one document with the date in its title appears in the Google Drive folder, that it is shared with the chosen preference, and that the Slack message links to it. The user deletes the test document, not the agent.

## Notes

- The Zap runs every day, so it creates one new document each day. Tell the user that; they may want to move old documents somewhere else.
- The AI writes the research from its own knowledge unless the AI step is given a web-search tool, so trends may lag the day. Review the document before posting anything from it.
- The engagement keyword and reply templates are drafts for a person to set up. The Zap doesn't reply to comments or post anywhere.
- Never commit a real Slack user ID, a Google document ID or a real niche that names a private person.
