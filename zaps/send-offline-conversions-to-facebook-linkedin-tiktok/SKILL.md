---
name: send-offline-conversions-to-facebook-linkedin-tiktok
description: Build a Zap on Zapier that sends a won Salesforce deal to Facebook, LinkedIn and TikTok as an offline conversion, using the deal's contact email, so paid campaigns optimize for closed revenue rather than form fills. Use when a team runs Salesforce and wants its ad platforms to see sales that happen offline.
license: MIT
metadata:
  author: zapier
  summary: "When a Salesforce deal closes won, its contact is sent to Facebook, LinkedIn and TikTok as a conversion, so your ad platforms learn from real revenue."
  apps: "Salesforce, Facebook Conversions, LinkedIn Conversions, TikTok Conversions"
  category: "Marketing"
  job: "Advertising ppc"
  source: "https://zapier.com/templates/details/offline-conversion-tracking-automation-facebook-tiktok-linkedin"
---

# Automate offline conversion tracking across platforms

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/send-offline-conversions-to-facebook-linkedin-tiktok. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a Salesforce opportunity is updated (`salesforce`, `updated_record`, with `object` set to `Opportunity`).
2. **Filter:** the run continues only if the opportunity's stage is `Closed Won`. Anything else stops quietly.
3. **Salesforce** finds the first contact on the opportunity's account and takes its email. If there is no contact or no email, the run stops quietly.
4. **Facebook, LinkedIn and TikTok** each receive one conversion for the contact, one after another. Every conversion carries the opportunity's ID as its event ID, so a deal that is updated again is counted once on each platform.

## Ask the user

Each `REPLACE_…` value is set per person. Look up IDs with the user's own connections; don't ask them to paste an ID you can look up.

| Setting                   | What goes there                                                                                                   |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `FACEBOOK_BUSINESS_ID`    | The Meta business account that sends the conversions. Look it up with the user's Facebook Conversions connection. |
| `FACEBOOK_PIXEL_ID`       | The Meta pixel that receives them. Look it up with the same connection.                                           |
| `LINKEDIN_ACCOUNT_ID`     | The LinkedIn ad account that sends the conversions. Look it up with the user's LinkedIn Conversions connection.   |
| `LINKEDIN_CONVERSION_ID`  | The LinkedIn conversion rule that counts a closed deal. Look it up with the same connection.                      |
| `TIKTOK_ADVERTISER_ID`    | The user's TikTok advertiser ID, shown in TikTok Ads Manager.                                                     |
| `TIKTOK_CRM_EVENT_SET_ID` | The CRM event set TikTok created for Salesforce, listed under the CRM events in TikTok Ads Manager.               |

Also review the defaults with the user:

- `CLOSED_WON_STAGE`: the opportunity stage value that counts as a won deal. Change it if the user's pipeline names it differently.
- `CLOSED_WON_EVENT_NAME`: the name the conversion carries on every platform.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `salesforce` to the user's Salesforce connection for the org that holds the opportunities. Bind `facebook-conversions`, `linkedin-conversions` and `tiktok-conversion` to the user's connections for those ad accounts.
2. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` value replaced by the user's answer. `triggers/updated-record.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with that slug, find the row whose `key` is `updated_record`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create and publish the workflow.
4. **Fields:** inspect the trigger's fields and the actions' fields with the user's connections before the first test run. The Salesforce `Contact` search, and the Facebook and TikTok send actions, need their keys checked against the live connection. Fix any key in `workflow.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) only after the user agrees to a test run in their accounts. Use a test opportunity the user created for this, not a real deal:

```json
{
  "Id": "006exampleopportunity",
  "StageName": "Closed Won",
  "AccountId": "001exampleaccount"
}
```

Confirm that each ad platform shows one test conversion with the test contact's email. If run-status tools aren't available, check each platform's events manager directly. The user deletes any test data, not the agent.

## Notes

- Once the Zap is published and its trigger is active, every update to a `Closed Won` opportunity sends conversions to all three platforms. Keep the stage value exact so only real wins count.
- The Zap sends the first contact's email on the account. If a deal's buyer is a different contact, the conversion goes to the first contact instead.
- The Zap sends the email in lowercase and doesn't hash it itself. Check each platform's action before the first run to confirm it hashes the email on its side.
- Never commit a real pixel, account, advertiser or event set ID, or a real email address.
