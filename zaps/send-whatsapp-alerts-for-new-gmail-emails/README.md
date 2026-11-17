# Notify via WhatsApp when new email arrives in Gmail

When a new email arrives in Gmail, your team gets a WhatsApp notification with the sender's name and a link to reply.

**Apps:** Gmail, WhatsApp Notifications

**Based on:** [Notify via WhatsApp when new email arrives in Gmail](https://zapier.com/templates/details/94923986275c6a06f93574f7cbf587f34f9f7fc853f9630a3621061cbaa39e34) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/send-whatsapp-alerts-for-new-gmail-emails

The agent follows `SKILL.md`: it asks you which label or mailbox to watch, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings, the same for everyone
- `connections/`: the accounts it uses (`gmail`, `whatsapp-notifications`)
- `triggers/`: what starts it
