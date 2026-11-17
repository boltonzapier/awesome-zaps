# Categorize customer feedback in Notion with theme tags using ChatGPT

Each new customer feedback item in your Notion database is tagged with the themes it raises, using ChatGPT, so you can filter and count feedback by theme.

**Apps:** Notion, ChatGPT (OpenAI)

**Based on:** [Categorize customer feedback in Notion with theme tags using ChatGPT](https://zapier.com/templates/details/6e6d3c840f4c87cc4b776d6d32b675c247849562b595d24ad4adb96ba0eaa23f) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/tag-customer-feedback-themes-in-notion-with-chatgpt

The agent follows `SKILL.md`: it asks you for your feedback database and the property that holds the feedback text, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`notion`, `chatgpt`)
- `triggers/`: what starts it
