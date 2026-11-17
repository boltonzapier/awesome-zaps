---
name: gmail-ai-reply-sender
description: Build a Zap on Zapier that reads each new Gmail email, has Google AI Studio's Gemini write a thoughtful reply, and sends that reply by Gmail to a recipient you choose. Use when someone wants draft replies to incoming email generated and passed to a colleague or a review inbox without writing them by hand.
license: MIT
metadata:
  author: zapier
  summary: "When a new email arrives in Gmail, Gemini writes a thoughtful reply and it is sent to the recipient you choose, so replies are ready to review."
  apps: "Gmail, Google AI Studio"
  category: "Customer Service & Success"
  job: "Customer support operations"
  source: "https://zapier.com/templates/details/7eacbc850c53f02da02ada4271b61b8d3d4b95c63e7540081bd0e1df36aad993"
---

# Generate thoughtful responses to new Gmail emails and send them to a specified recipient

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/gmail-ai-reply-sender. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new email arrives in the watched Gmail label or mailbox (`gmail`, `message`, New Email). The trigger brings the sender, subject and plain-text body.
2. **Google AI Studio** (`google-ai-studio`, `send_prompt`) asks Gemini to write a concise, professional reply to that email, with no subject line and no signature.
3. **Gmail** (`gmail`, `message`, Send Email) sends the reply to the recipient you set, with the subject "Suggested reply: <original subject>" and the original sender named at the top.

The Zap sends nothing to the original sender. It skips emails with no body text, and it stops if Gemini returns an empty reply.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting            | Where                              | What goes there                                                                                          |
| ------------------ | ---------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `REPLACE_LABEL_ID` | `triggers/message.ts`, `label_ids` | The Gmail label or mailbox to watch. Usually the Inbox. Look up its ID with the user's Gmail connection. |
| `RECIPIENT_EMAIL`  | `config.ts`                        | The address that receives the generated replies. Ask the user for it directly.                           |

Also review the default with them:

- `AI_MODEL`: the Gemini model that writes the reply. The default is `gemini-2.5-flash`. Keep it unless the user wants another model from their Google AI Studio account.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

Connections (each alias is the app's slug, bound to one of the user's accounts):

- `gmail`: the Gmail account whose new emails get replies. The trigger and the send step both use it.
- `google-ai-studio`: a Google AI Studio account with access to a Gemini model.

1. **Accounts:** bind `gmail` and `google-ai-studio` to the user's connections. The `connections/` files are settings, not code.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. Set the trigger from `triggers/message.ts`: the app `gmail`, the event `message`, and `label_ids` set to the chosen label. For the trigger's `selected_api`, call `search_triggers` with `gmail`, find the row whose `key` is `message`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect the Gmail send action and the Google AI Studio `send_prompt` action with the user's connections before the first test run, and fix any key in `workflow.ts` that doesn't match. Confirm the trigger's output still provides `message_id`, `from`, `subject` and `body_plain`.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with the recipient set to an address the user controls:

```json
{
  "message_id": "EXAMPLE-MESSAGE-ID",
  "from": {
    "name": "Sample Sender"
  },
  "subject": "Question about pricing",
  "body_plain": "Could you share the pricing for the team plan? We have about twenty users.",
  "date": "2026-11-10T09:00:00Z"
}
```

Confirm that one email arrived at the recipient with the subject "Suggested reply: Question about pricing" and a reply body. If run-status tools aren't available, check the recipient's inbox directly. Then publish, and send a real test email to the watched label to confirm the trigger fires.

## Notes

- Gemini writes the reply from the email text alone. Review generated replies before anyone sends them to a customer.
- The Zap never changes or deletes the original email.
- Each new email sends one email to the recipient, so a busy label means many emails. Watch a narrow label if that is too many.
- Never commit a real recipient address.
