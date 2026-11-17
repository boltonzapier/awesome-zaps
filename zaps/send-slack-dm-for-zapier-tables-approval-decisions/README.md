# Approval Request Template

Take the hassle out of approvals: when someone clicks Approve or Reject on a request in your approval table, the requester gets a Slack message with the decision.

**Apps:** Slack, Zapier Tables

**Based on:** [Approval Request Template](https://zapier.com/templates/details/approval-request) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/send-slack-dm-for-zapier-tables-approval-decisions

The agent follows `SKILL.md`: it asks you for your approval table, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings: the button field keys and the two messages
- `connections/`: the accounts it uses (`slack`, `zapier-tables`)
- `triggers/`: what starts it
