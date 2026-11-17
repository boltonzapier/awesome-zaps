# Deal desk: Manage HubSpot quote approvals in Slack

When HubSpot posts a quote that is ready for approval, it is logged in a Zapier Table and an approval request with the deal and quote links is posted to Slack.

**Apps:** Webhooks by Zapier, Zapier Tables, Slack

**Based on:** [Deal desk: Manage HubSpot quote approvals in Slack](https://zapier.com/templates/details/deal-desk-manage-hubspot-quote-approvals-slack) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/post-hubspot-quote-approval-requests-to-slack

The agent follows `SKILL.md`: it asks you for your quote table, approval channel, approvers and HubSpot account ID, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`slack`, `zapier-tables`)
- `triggers/`: what starts it
