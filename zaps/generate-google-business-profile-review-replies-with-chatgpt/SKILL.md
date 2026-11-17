---
name: generate-google-business-profile-review-replies-with-chatgpt
description: Build a Zap on Zapier that reads each new Google Business Profile review, has ChatGPT write a personalized public reply to it, and posts that reply under the review. Use when a local business wants every new review answered with a reply written for that review's wording and star rating, without writing each one by hand.
license: MIT
metadata:
  author: zapier
  summary: "Each new Google review gets a personalized reply written by ChatGPT and posted under it, so reviewers hear back in their own context."
  apps: "Google Business Profile, ChatGPT"
  category: "Marketing"
  job: "Review reputation management"
  source: "https://zapier.com/templates/details/bed3d2e81190a23d9791121fcb5a74795e7027f3cb238dbc1bd7c5b3d27b617b"
---

# Generate and post personalized replies to new Google Business Profile reviews with ChatGPT

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/generate-google-business-profile-review-replies-with-chatgpt. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a new review on the watched location in Google Business Profile (`google-business-profile`, `new_review_v3`). The trigger brings the review's name, ID, comment, star rating and reviewer display name.
2. **ChatGPT** writes a short reply for that review, addressed to the reviewer's first name (or "there" if no name is given). The reply follows the instructions in `config.ts`.
3. **Code** skips the review if ChatGPT returns an empty reply, so nothing blank is ever posted.
4. **Google Business Profile** posts the reply under the review.

The reply is public, so review the instructions in `config.ts` before turning the Zap on. Google's content policy applies.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve names to IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting               | Where                                       | What goes there                                                |
| --------------------- | ------------------------------------------- | -------------------------------------------------------------- |
| `REPLACE_LOCATION_ID` | `triggers/new-review.ts`, `params.location` | The Google Business Profile location whose reviews get replies |

Confirm the Google account to connect manages that location. It is the account bound to `google-business-profile` in step 1 of Build it.

Also review the defaults with them:

- `INSTRUCTIONS` in `config.ts`: how ChatGPT writes each reply. Check it matches the business's voice and what it can promise.
- `MODEL` in `config.ts`: the ChatGPT model. Any model the user's ChatGPT connection can call works.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `google-business-profile` to the user's Google Business Profile connection for the account that manages the location, and `chatgpt` to the user's ChatGPT (OpenAI) connection.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer. `triggers/new-review.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them, and set the trigger's `location` from the user's answer. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is the trigger's `event`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect each action's fields with the user's connection and sample the trigger before the first test run, and fix any key in `workflow.ts` that doesn't match.

## Test it

Run it once as a draft test with a sample review on a location the user controls, since the reply is public:

```json
{
  "id": "REVIEW_ID",
  "name": "accounts/ACCOUNT_ID/locations/LOCATION_ID/reviews/REVIEW_ID",
  "comment": "The team fixed our boiler the same day and explained every step. Thank you!",
  "starRating": "FIVE",
  "reviewer__displayName": "Sam Lee"
}
```

Check that the review shows a reply that opens with "Hi Sam," and that the run's output has `reply` and `updated` set. If run-status tools aren't available, check the review in Google Business Profile directly. Ask the user to delete the test reply; the agent doesn't delete test data. Then publish, confirm the trigger is active, and leave it on only once the test has passed.

## Notes

- The reply is public and visible to everyone on Google. Test on a location the user controls.
- Posting a reply replaces any reply already on the review. The trigger fires only on new reviews, so this is rare, but a re-delivered review gets a fresh reply.
- ChatGPT writes each reply from the review text and star rating only. Review a few generated replies before leaving the Zap on, especially for negative reviews.
- Reviewers' names come from Google. The workflow uses only the first word of the display name.
