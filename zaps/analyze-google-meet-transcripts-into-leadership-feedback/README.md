# Exec coach: Turn meeting insights into exec growth feedback by Tomás, CIO @ Miro

Each new Google Meet transcript or notes doc gets a coaching analysis of the leader's communication and decisions, appended to one feedback doc.

**Apps:** Google Drive, Google Docs, AI by Zapier

**Based on:** [Exec coach: Turn meeting insights into exec growth feedback by Tomás, CIO @ Miro](https://zapier.com/templates/details/ai-leadership-coaching-google-meet-feedback-automation) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/analyze-google-meet-transcripts-into-leadership-feedback

The agent follows `SKILL.md`: it asks you for your Meet folder, the leader's details and your feedback doc, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-drive`, `google-docs`, `ai`)
- `triggers/`: what starts it
