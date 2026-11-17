# Automate HR support with AI helpdesk assistant

Answers each new HR question posted in a Slack channel from an FAQ table with AI, replies in the thread, and logs every request to a Zapier Table. Questions the FAQs don't cover are escalated to the HR team.

Based on [the HR help desk template](https://zapier.com/templates/details/automate-hr-support-ai-helpdesk-assistant) on zapier.com.

**Apps:** Slack, AI by Zapier, Zapier Tables

## Install

Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/answer-hr-questions-from-slack-with-ai-helpdesk

## Files

- `SKILL.md`: the instructions an agent follows to build and test the Zap
- `workflow.ts`: the steps: acknowledge, load FAQs, answer with AI, log the request, reply
- `config.ts`: the Slack channel and Zapier Table IDs, the AI model, and the table column keys
- `triggers/channel-message.ts`: the Slack channel that starts the Zap
- `connections/slack.ts` and `connections/zapier-tables.ts`: the accounts the Zap uses
