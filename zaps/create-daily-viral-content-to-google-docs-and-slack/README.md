# Viral Content Creation Agent

Every morning, AI drafts a viral video package for your niche (topic, hook, short and long scripts, captions, a newsletter post and an engagement plan), saves it as a Google Doc, shares it, and sends you the link on Slack.

**Apps:** AI by Zapier, Google Docs, Google Drive, Schedule by Zapier, Slack

**Based on:** [Viral Content Creation Agent](https://zapier.com/templates/details/viral-content-creation-agent) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/create-daily-viral-content-to-google-docs-and-slack

The agent follows `SKILL.md`: it asks you for your niche, your Slack recipient and who can open the document, then builds the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-docs`, `google-drive`, `slack`)
- `triggers/`: what starts it
