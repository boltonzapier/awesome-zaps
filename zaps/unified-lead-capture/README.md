# Unified lead capture

Leads from your ad, form and lead-gen sources are cleaned up and added to HubSpot as one consistent contact, so no one checks each platform by hand.

**Apps:** Webhooks by Zapier, AI by Zapier, HubSpot

**Based on:** [Unified lead capture](https://zapier.com/templates/details/unified-lead-capture) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/unified-lead-capture

The agent follows `SKILL.md`: it connects your HubSpot account, then builds the Zap and turns it on.

## Files

- `SKILL.md`: what the agent builds and how to test it
- `workflow.ts`: the Zap's code
- `lib/normalize.ts`: name split, company-size ranges and blank-value handling
- `connections/`: the account it uses (`hubspot`)
- `triggers/`: what starts it
