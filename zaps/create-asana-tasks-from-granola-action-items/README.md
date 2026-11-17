# Track your action items from Granola notes by creating Asana tasks

Each new Granola meeting note is read by AI, and every action item in it becomes an Asana task with its priority, due date and source meeting.

**Apps:** Granola, AI by Zapier, Asana

**Based on:** [Track your action items from Granola notes by creating Asana tasks](https://zapier.com/templates/details/turn-granola-notes-into-tasks) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/create-asana-tasks-from-granola-action-items

The agent follows `SKILL.md`: it asks you for your Granola folder and your Asana project, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`granola`, `ai`, `asana`)
- `triggers/`: what starts it
