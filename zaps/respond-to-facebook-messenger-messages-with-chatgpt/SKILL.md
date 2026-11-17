---
name: respond-to-facebook-messenger-messages-with-chatgpt
description: Build a Zap on Zapier that answers each new message sent to a Facebook page with a reply written by ChatGPT, then sends that reply back to the customer in Messenger. Use when a business wants fast, consistent first replies to Messenger customers without writing each one by hand.
license: MIT
metadata:
  author: zapier
  summary: "Each new customer message to your Facebook page gets a personalized ChatGPT reply, sent back in Messenger."
  apps: "Facebook Messenger, ChatGPT"
  category: "Customer Service & Success"
  job: "Omnichannel support"
  source: "https://zapier.com/templates/details/b3b2dbcc7decba4af3d2ce03e272d4d7d43a27a3a8d479eb104891b260347569"
---

# Respond to customer inquiries on Facebook Messenger, generate replies with ChatGPT, and send messages from your page

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/respond-to-facebook-messenger-messages-with-chatgpt. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new message is sent to the Facebook page (`facebook-messenger`, `message`).
2. **ChatGPT** writes a reply to the message, using the instructions in `config.ts` and the business name the user gives.
3. **Facebook Messenger** sends that reply back to the customer from the page.

Messages with no text, such as stickers or photos alone, and the page's own messages are skipped.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting         | Where                                          | What goes there                                                                                                                     |
| --------------- | ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `BUSINESS_NAME` | `config.ts`                                    | The name replies are written as, such as the business or page name. Ask the user for it.                                            |
| `PAGE_ID`       | `config.ts` and `triggers/message.ts` (`page`) | The Facebook page's ID. Look it up from the page list on the user's Facebook Messenger connection; the same value fills both files. |

Also review the defaults with them:

- `DEFAULT_MODEL`: the model that writes the replies. Defaults to `gpt-4o`.
- `SYSTEM_INSTRUCTIONS`: the tone and limits of the replies. Check they match how the business wants to sound.
- `POLL_INTERVAL_SECONDS` and `MAX_POLLS` in `config.ts`: how long the Zap waits for ChatGPT, by default 30 seconds between checks and 20 checks.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `facebook-messenger` to the user's Facebook Messenger connection for the page that receives customer messages, and `chatgpt` to the user's ChatGPT (OpenAI) connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/message.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** sample the Messenger trigger and inspect the `send_message` action and the ChatGPT `conversation_responses_api` action with the user's connections before the first test run. Fix any key in `workflow.ts` that doesn't match: the trigger's text and sender fields (`text`, `sender__id`, `sender__name`) and the send action's recipient and text inputs (`recipient`, `text`).

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), with the Messenger send pointed at a test conversation the user owns, not a real customer:

```json
{
  "text": "Hi, what are your opening hours on Saturday?",
  "sender__id": "1234567890",
  "sender__name": "Test Customer"
}
```

Confirm that the test conversation receives one reply that answers the question and matches the tone in `SYSTEM_INSTRUCTIONS`. If run-status tools aren't available, check the reply in the Messenger conversation directly. The user deletes the test messages, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every new message to the page gets a reply. Start with a page that has a few conversations, and check the first replies before leaving it on.
- The Zap never answers its own replies. The trigger's only setting is `page`, so it has no incoming-only option, and its output fields could not be confirmed. `workflow.ts` therefore skips, before calling ChatGPT, any message whose `sender__id` equals `PAGE_ID` or whose `is_echo` is true. When you sample the trigger, check which of these fields it really delivers (a page ID field or an echo flag under another name) and fix the guard to match; if the page's own sends never arrive, the guard is harmless.
- Replies can take up to about 10 minutes to arrive, since the Zap waits for ChatGPT between checks.
- ChatGPT writes replies without knowing the business's details. Put facts such as hours, prices or policies into `SYSTEM_INSTRUCTIONS` before going live.
- Never commit a real page ID, a real customer's name or message, or a real ChatGPT key.
