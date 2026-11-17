# Save new Gmail attachments to Google Drive folder

Every new email attachment in your Gmail is saved to the Google Drive folder you choose, so your files stay organized and easy to find.

**Apps:** Gmail, Google Drive

**Based on:** [Save new Gmail attachments to Google Drive folder](https://zapier.com/templates/details/bc90b815b513a98ddb0be95bae561a975052c05554261e374e36bbf0093d4bd6) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/save-new-gmail-attachments-to-google-drive

The agent follows `SKILL.md`: it asks you for the Google Drive folder that receives the files, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings; the `REPLACE_…` value is filled in for each person
- `connections/`: the accounts it uses (`gmail`, `google-drive`)
- `triggers/`: what starts it
