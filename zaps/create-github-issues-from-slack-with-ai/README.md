# Create GitHub issues from Slack instantly

When a teammate pushes a Slack message to the Zapier bot, an AI-drafted GitHub issue is created from it and the thread gets the issue link.

**Apps:** Slack, GitHub, AI by Zapier

**Based on:** [Create GitHub issues from Slack instantly](https://zapier.com/templates/details/automate-github-issues-from-slack) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/create-github-issues-from-slack-with-ai

The agent follows `SKILL.md`: it asks you for the repository that gets the issues, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`slack`, `github`)
- `triggers/`: what starts it
