# Notify users via email when new Google Forms response is submitted and remind them of their responsibilities

When someone submits your Google Form, they get an email from Gmail confirming their request and reminding them of their responsibilities.

**Apps:** Google Forms, Gmail

**Based on:** [Notify users via email when new Google Forms response is submitted and remind them of their responsibilities](https://zapier.com/templates/details/5d0fc691509e3ac9f0727fa45f32e46870a55aefab2184371c1a678c6cf6d513) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/send-reminder-emails-to-google-forms-respondents

The agent follows `SKILL.md`: it asks you for the form's email question, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-forms`, `gmail`)
- `triggers/`: what starts it
