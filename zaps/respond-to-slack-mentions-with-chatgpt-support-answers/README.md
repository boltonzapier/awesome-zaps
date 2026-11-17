# Respond to user mentions in Slack with AI-generated support answers

When someone mentions the support account in a Slack channel, ChatGPT writes a short answer and the Zap posts it in the same thread.

**Apps:** Slack, ChatGPT (OpenAI)

**Based on:** [Respond to user mentions in Slack with AI-generated support answers](https://zapier.com/templates/details/0887125cb5260ae5f5e74ba405e58f62f799718b31d815af0898ff4a19b4baf6) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/respond-to-slack-mentions-with-chatgpt-support-answers

The agent follows `SKILL.md`: it asks you which Slack user's mentions get answers, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings, including the model and the support prompt
- `connections/`: the accounts it uses (`slack`, `chatgpt`)
- `triggers/`: what starts it
