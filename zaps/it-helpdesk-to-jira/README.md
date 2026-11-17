# IT help desk to Jira

When someone posts an IT request in your Slack channel, a Jira ticket is created for it and the thread gets the ticket's key and link.

**Apps:** Slack, Jira Software Cloud

**Based on:** [IT help desk](https://zapier.com/templates/details/it-helpdesk) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/it-helpdesk-to-jira

The agent follows `SKILL.md`: it asks you for your request channel and Jira project, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`slack`, `jira-software-cloud`)
- `triggers/`: what starts it
