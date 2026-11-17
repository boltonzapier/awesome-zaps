# Automated Email Reply Drafts Agent

Every new inbox email gets a draft reply in your own tone, with meeting times from your calendar and web research where needed, ready for you to review and send.

**Apps:** Gmail, Google Calendar, AI by Zapier

**Based on:** [Automated Email Reply Drafts Agent](https://zapier.com/templates/details/automated-email-reply-drafts-agent-76a3e6) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/create-automated-email-reply-drafts-in-gmail

The agent follows `SKILL.md`: it asks you for your calendar and builds the Zap in your account, with reply drafts created for you to review.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`gmail`, `google-calendar`)
- `triggers/`: what starts it (`message.ts`, a new inbox email)
