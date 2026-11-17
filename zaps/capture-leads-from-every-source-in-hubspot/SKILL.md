---
name: capture-leads-from-every-source-in-hubspot
description: Build a Zap on Zapier that takes leads from several sources, standardizes their name, company size, job role and seniority, and creates or updates each one as a contact in HubSpot. Use when leads arrive from ads, forms and lead-gen tools and the sales team wants them in one CRM with consistent fields.
license: MIT
metadata:
  author: zapier
  summary: "Leads from your ad, form and lead-gen sources are cleaned up and added to HubSpot as one consistent contact, so no one checks each platform by hand."
  apps: "Webhooks by Zapier, AI by Zapier, HubSpot"
  category: "Marketing"
  job: "Lead management"
  source: "https://zapier.com/templates/details/unified-lead-capture"
---

# Unified lead capture

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/capture-leads-from-every-source-in-hubspot. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** a lead arrives at a Webhooks by Zapier catch hook (`webhook`, `hook_v2`). Each lead source posts its lead to that hook as JSON, with the keys listed under Notes.
2. The Zap stops with no write if the lead has no email address.
3. It splits the name into first and last name, using the given names when the source sends them and the full name when it doesn't.
4. It maps the company size to HubSpot's size ranges (`1-5`, `5-25`, `25-50`, `50-100`, `100-500`, `500-1000`, `1000+`).
5. **AI by Zapier** classifies the job role and the seniority into HubSpot's values. Blank input is left blank.
6. **HubSpot** creates the contact, or updates it when the email already exists.

## Ask the user

Nothing to ask. The Zap has no settings to set. Connect the HubSpot account in the Build it section below.

## Build it

**Trigger:** `webhook` / `hook_v2` (Webhooks by Zapier, Catch Hook). It has no connection.

**Connections:**

- `hubspot`: the HubSpot portal that receives the leads. Pick the account that owns the contacts; it must be able to create and update them.

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Accounts:** bind `hubspot` to the user's HubSpot connection. Webhooks by Zapier and AI by Zapier need no connection of this kind; AI by Zapier uses Zapier-managed credentials.
2. **Source:** publish `workflow.ts` and `lib/normalize.ts`. `triggers/hook.ts` and `connections/` are settings, not code: set the workflow's trigger and connection bindings from them. The trigger file names the app by its slug; for the trigger's `selected_api`, call `search_triggers` with `webhook`, find the row whose `key` is `hook_v2`, and use `<app_key>@<app_version>` from it.
3. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create, test and publish the workflow.
4. **Fields:** inspect each action's fields with the user's connection before the first test run, and fix any key in `workflow.ts` that doesn't match. The HubSpot `upsert_contact` action is the one most likely to need it.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP), using an address on the reserved `example.com` domain:

```json
{
  "email": "jordan.lee@example.com",
  "full_name": "Jordan Lee",
  "job_title": "Operations Manager",
  "employment_role": "Operations manager",
  "employment_seniority": "Manager",
  "company_name": "Example Co",
  "number_of_employees": "100 to 250",
  "phone_number": "+15555550100",
  "linkedin_url": "https://www.linkedin.com/in/example",
  "message": "Interested in a demo",
  "source": "sample"
}
```

Confirm the HubSpot contact for `jordan.lee@example.com` has the first name `Jordan`, last name `Lee`, company size `50-100`, and a role and seniority value from the lists in `workflow.ts`.

## Notes

- Once the Zap is published and its trigger is active, give the user the webhook URL. Each lead source posts to it; anyone with that URL can add contacts to HubSpot, so never commit it.
- Keys the catch hook accepts: `email`, `first_name`, `last_name`, `full_name`, `job_title`, `employment_role`, `employment_seniority`, `company_name`, `number_of_employees`, `phone_number`, `linkedin_url`, `message`, `source`. Each value is text. Map a source's own field names to these in the source's Zap before it posts.
- A lead source that Zapier has no catch-hook path for needs its own Zap that reads the source and posts to this hook.
- Role and seniority come from a model, so check the first few contacts in HubSpot. Blank input stays blank.
- The company size is the lower end of the range the source sends, so `250 to 500` becomes `100-500`.
- Never commit a real HubSpot portal or contact.
