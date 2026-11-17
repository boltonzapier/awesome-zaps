---
name: save-new-gmail-attachments-to-google-drive
description: Build a Zap on Zapier that saves every new Gmail email attachment to a chosen Google Drive folder, keeping each file's original name. Use when someone wants incoming email attachments filed in Google Drive automatically instead of downloaded and uploaded by hand.
license: MIT
metadata:
  author: zapier
  summary: "Every new email attachment in your Gmail is saved to the Google Drive folder you choose, so your files stay organized and easy to find."
  apps: "Gmail, Google Drive"
  category: "Personal Productivity"
  job: "File management"
  source: "https://zapier.com/templates/details/bc90b815b513a98ddb0be95bae561a975052c05554261e374e36bbf0093d4bd6"
---

# Save new Gmail attachments to Google Drive folder

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/save-new-gmail-attachments-to-google-drive. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new email arrives with an attachment (`gmail`, `attachment`).
2. **Google Drive** (`google-drive`) uploads that attachment to the folder you chose, under its original file name.

The Zap only adds files to Drive. It never changes, labels, moves or deletes emails.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting           | What goes there                                                                                                                             |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `DRIVE_FOLDER_ID` | The Google Drive folder that receives the attachments. Ask which folder it is, then look up its ID (the long ID in its URL). It must exist. |

The trigger watches the whole mailbox by default. If the user wants only some emails saved, set the trigger's `label_ids` or `query` (Gmail search syntax) to narrow it, and say so in your summary.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `gmail` to the user's Gmail connection for the mailbox whose attachments get saved, and `google-drive` to the Google Drive connection for the account that owns the folder.
2. **Source:** publish `workflow.ts` and `config.ts`, with `DRIVE_FOLDER_ID` replaced by the user's answer. `triggers/new-attachment.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `attachment`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the trigger's fields and the Google Drive `file` (Upload File) action's fields with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Send a test email with a small file attached to the mailbox, then run this sample as a draft test (`run_workflow_draft` in Zapier MCP). Use a test email the user sent to themselves, not a real one, and put `[install-test]` in the name of any test folder.

```json
{
  "message_id": "18c0example",
  "filename": "test-attachment.pdf",
  "attachment": "<URL or file of the test PDF>"
}
```

Confirm that `test-attachment.pdf` appears in the destination folder. If run-status tools aren't available, check Google Drive directly. The user deletes the test file, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every new attachment that matches the trigger is saved. Narrow the trigger first if the mailbox gets a lot of attachments.
- Files keep the names they arrived with. Two attachments with the same name in one folder both get saved.
- Keep real folder IDs and account names out of any copy you share.
