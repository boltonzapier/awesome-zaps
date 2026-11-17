# Respond to customer inquiries on Facebook Messenger, generate replies with ChatGPT, and send messages from your page

Each new message sent to your Facebook page gets a personalized reply written by ChatGPT and sent back to the customer in Messenger, so customers hear back quickly.

**Apps:** Facebook Messenger, ChatGPT

**Based on:** [Respond to customer inquiries on Facebook Messenger, generate replies with ChatGPT, and send messages from your page](https://zapier.com/templates/details/b3b2dbcc7decba4af3d2ce03e272d4d7d43a27a3a8d479eb104891b260347569) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/respond-to-facebook-messenger-messages-with-chatgpt

The agent follows `SKILL.md`: it asks you for your business name and your page, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`facebook-messenger`, `chatgpt`)
- `triggers/`: what starts it
