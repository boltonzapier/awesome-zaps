# Smart follow-up emails: From Gong calls to AI followup drafts

Every Gong call gets a personalized follow-up email draft, a HubSpot task to send it, and a Slack message to the organizer with both links.

**Apps:** Gong, HubSpot, Slack, AI by Zapier

**Based on:** [Smart follow-up emails: From Gong calls to AI followup drafts](https://zapier.com/templates/details/automate-sales-follow-up-emails-gong-hubspot) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/draft-follow-up-emails-from-gong-calls-to-hubspot

The agent follows `SKILL.md`: it asks you for your Gong API base URL, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `lib/follow-up.ts`: pure helpers that read Gong's call data and build the email inputs
- `connections/`: the accounts it uses (`gong`, `hubspot`, `slack`, `ai`)
- `triggers/`: what starts it
