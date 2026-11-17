# AI Content Idea Generator Template

Each new content idea added to your Zapier Table gets five related ideas from ChatGPT, saved back to the table as drafts for review.

**Apps:** ChatGPT (OpenAI), Zapier Tables

**Based on:** [AI Content Idea Generator Template](https://zapier.com/templates/details/ai-content-idea-generator) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/generate-content-ideas-with-chatgpt-in-zapier-tables

The agent follows `SKILL.md`: it asks you for your ideas table, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`zapier-tables`, `chatgpt`)
- `triggers/`: what starts it
