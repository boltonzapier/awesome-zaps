# Auto-capture tool & process updates from Slack in a centralized changelog

A Slack reaction with the changelog emoji turns that message into a titled changelog entry in a Zapier Table, and the thread confirms it.

**Apps:** Slack, AI by Zapier, Zapier Tables

**Based on:** [Auto-capture tool & process updates from Slack in a changelog](https://zapier.com/templates/details/slack-changelog-automation) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/log-slack-changelog-reactions-to-zapier-tables

The agent follows `SKILL.md`: it asks you for your team directory table, your changelog table and the changelog link, then builds and tests the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`slack`, `zapier-tables`, `ai`)
- `triggers/`: what starts it
