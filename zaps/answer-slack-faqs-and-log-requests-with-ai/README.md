# Manage FAQs and requests from Slack with AI

Questions posted in your help channel get an answer from your FAQ table with AI. Anything the FAQ can't answer is logged as a request in your help requests table, and the thread says so.

**Apps:** Slack, Zapier Tables, AI by Zapier

**Based on:** [Manage FAQs and requests from Slack with AI](https://zapier.com/templates/details/helpdesk-automation-template-slack-clickup) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/answer-slack-faqs-and-log-requests-with-ai

The agent follows `SKILL.md`: it asks you for your help channel, FAQ table and help requests table, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`slack`, `zapier-tables`)
- `triggers/`: what starts it
