# Analyze client responses in Google Forms, summarize with ChatGPT, and email coaching team via Gmail

Each new client questionnaire response is summarized by ChatGPT into key themes and potential flags, and the summary is emailed to your coaching team through Gmail.

**Apps:** Google Forms, ChatGPT (OpenAI), Gmail

**Based on:** [Analyze client responses in Google Forms, summarize with ChatGPT, and email coaching team via Gmail](https://zapier.com/templates/details/c68c5187045332be3e08bfa86df8db8b8c5ac5b1f5250558d84141935e1d93ea) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/summarize-google-forms-responses-with-chatgpt-and-gmail

The agent follows `SKILL.md`: it asks you for your client questionnaire and the coaching team's address, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`google-forms`, `chatgpt`, `gmail`)
- `triggers/`: what starts it
