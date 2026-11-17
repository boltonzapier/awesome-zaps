---
name: create-github-issues-from-slack-with-ai
description: Build a Zap on Zapier that turns a Slack message a teammate pushes to the Zapier bot into a GitHub issue, drafted by AI by Zapier in a problem, solution and tasks layout, then replies in the Slack thread with the issue link. Use when a team turns bug reports and feature requests from Slack into GitHub issues by hand and wants that step done for them.
license: MIT
metadata:
  author: zapier
  summary: "A Slack message pushed to your Zapier bot becomes a GitHub issue with an AI-drafted title and body, and the thread gets the issue link."
  apps: "Slack, GitHub, AI by Zapier"
  category: "Engineering"
  job: "Software delivery"
  source: "https://zapier.com/templates/details/automate-github-issues-from-slack"
---

# Create GitHub issues from Slack instantly

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/create-github-issues-from-slack-with-ai. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a teammate pushes a Slack message to the Zapier bot (`slack`, `pushed_message_v2`). The trigger also delivers the message text, its author, its channel and its permalink.
2. **Workflow** skips replies inside an existing thread and empty messages.
3. **AI by Zapier** drafts a title (80 characters at most) and a description with Problem Definition, Proposed Solution and Tasks sections, from the message alone.
4. **Workflow** adds a Meta block with the Slack link and the author to the description.
5. **GitHub** creates an issue in the repository with that title and body.
6. **Slack** replies in the message's thread with the issue link.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting       | Where       | What goes there                                                                                                                       |
| ------------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `GITHUB_REPO` | `config.ts` | The repository that gets the issues, as `owner/name`. Ask which one, then check the user's GitHub connection can create issues in it. |

Also review with the user:

- `MODEL_ID`: `standard/auto` lets Zapier pick an account-usable model. Change it only if the team needs a specific model, which may need its own AI connection.
- `name` and `access_type` in `triggers/pushed-message.ts`: the label Slack shows for the automation, and who in the workspace can push messages to it.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `slack` to the user's Slack connection for the workspace where the bot lives, and `github` to the user's GitHub connection with access to the repository. The AI step uses Zapier-managed credentials (`authentication_id` `"0"`) and needs no connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with `GITHUB_REPO` replaced by the user's answer. `triggers/pushed-message.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with `slack`, find the row whose `key` is `pushed_message_v2`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Slack trigger's output fields, the AI step's `get_completion` fields and the GitHub `issue` action's fields with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) in a test channel the user owns. Post the test issue to a test repository, not a real one:

```json
{
  "message": {
    "ts": "1700000000.000100",
    "raw_text": "Export to CSV drops the last row when the report has more than 500 lines.",
    "permalink": "https://example.slack.com/archives/C0123456789/p1700000000000100",
    "user": { "name": "test.user", "real_name": "Test User" },
    "channel": { "id": "C0123456789", "name": "test-channel" }
  }
}
```

Confirm that one issue was created in the test repository with a title and the three sections, a Meta block linking the Slack message, and that the thread reply shows the issue link. The user closes or deletes the test issue, not the agent.

## Notes

- Every message pushed to the bot opens an issue. Keep the bot's access to people who should file issues.
- The AI draft follows the layout in `INSTRUCTIONS` in `workflow.ts`. Change that text to match the team's issue format.
- The Zap reads the message only. It doesn't fetch the rest of the Slack thread, so context that lives only in earlier replies won't reach the issue. Push the message with the context in it.
- To add labels or assign an owner, add the GitHub fields to the `issue` step. To also send a direct message to the person who pushed the message, add a Slack `direct_message` step after the reply.
- Never commit a real repository name that identifies a private project.
