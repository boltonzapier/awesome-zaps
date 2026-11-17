# Email assistant: Turn starred emails into Asana tasks with AI

When you star an email in Gmail, AI turns the actions in it into Asana tasks with due dates, attaches the email's files, and sends you a Slack message with links.

**Apps:** Gmail, Asana, AI by Zapier, Slack

**Based on:** [Email assistant: Turn starred emails into Asana tasks with AI](https://zapier.com/templates/details/email-assistant-turn-starred-emails-into-asana-tasks-with-ai) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/create-asana-tasks-from-starred-gmail-emails-with-ai

The agent follows `SKILL.md`: it asks you for your Asana workspace, project and assignee and your Slack channel, then builds the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`gmail`, `asana`, `slack`, `ai`)
- `triggers/`: what starts it
