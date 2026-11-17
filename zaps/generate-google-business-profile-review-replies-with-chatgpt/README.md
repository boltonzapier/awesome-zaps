# Generate and post personalized replies to new Google Business Profile reviews with ChatGPT

Each new Google review gets a personalized public reply, written by ChatGPT for that review's wording and star rating, and posted under it.

**Apps:** Google Business Profile, ChatGPT

**Based on:** [Generate and post personalized replies to new Google Business Profile reviews with ChatGPT](https://zapier.com/templates/details/bed3d2e81190a23d9791121fcb5a74795e7027f3cb238dbc1bd7c5b3d27b617b) on zapier.com

## Install

This folder is a Zap template. Paste this into your AI agent:

> Build me this Zap, read how here: https://github.com/zapier/awesome-zaps/tree/main/zaps/generate-google-business-profile-review-replies-with-chatgpt

The agent follows `SKILL.md`: it asks you which Google Business Profile location to watch, then builds, tests and turns on the Zap in your account.

## Files

- `SKILL.md`: what the agent asks, builds and tests
- `workflow.ts`: the Zap's code
- `config.ts`: its settings, including the instructions ChatGPT follows for each reply
- `connections/`: the accounts it uses (`google-business-profile`, `chatgpt`)
- `triggers/`: what starts it
