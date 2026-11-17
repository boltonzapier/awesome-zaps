# Generate thoughtful responses to new Gmail emails and send them to a specified recipient

When a new email arrives in Gmail, Gemini writes a thoughtful reply and it is sent to the recipient you choose, so replies are ready to review.

**Apps:** Gmail, Google AI Studio

**Based on:** [Generate thoughtful responses to new Gmail emails and send them to a specified recipient](https://zapier.com/templates/details/7eacbc850c53f02da02ada4271b61b8d3d4b95c63e7540081bd0e1df36aad993) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/send-ai-replies-for-new-gmail-emails

The agent follows `SKILL.md`: it asks you which Gmail label to watch and which address gets the replies, then builds the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` values are filled in for each person
- `connections/`: the accounts it uses (`gmail`, `google-ai-studio`)
- `triggers/`: what starts it
