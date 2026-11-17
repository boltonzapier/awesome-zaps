---
name: email-meeting-minutes-recap-from-zapier-tables
description: Build a Zap on Zapier that emails the meeting minutes from a Zapier Tables record when someone clicks its Send Recap button, with the date, title, attendees, key points, decisions, action items and owner. Use when a team records meeting minutes in a Zapier Table and wants the recap sent to attendees or a manager from the record itself.
license: MIT
metadata:
  author: zapier
  summary: "Click the Send Recap button on a meeting's row and its minutes are emailed out, so the recap goes to the team without retyping anything."
  apps: "Zapier Tables, Email by Zapier"
  category: "Executives"
  job: "Meeting management"
  source: "https://zapier.com/templates/details/meeting-minutes"
---

# Meeting Minutes Template

The Zap's code lives at https://github.com/zapier/awesome-zaps/tree/main/zaps/email-meeting-minutes-recap-from-zapier-tables. Read the files there if this skill was installed on its own.

## What it does

1. **Trigger:** someone clicks the "Send Recap" button on a record in the meeting minutes table (`zapier-tables`, `button_click_record`). The trigger brings that record's ID and fields.
2. **Email by Zapier** sends the recap under the subject "Meeting minutes recap", with the record's date, meeting title, attendees, key points, decisions made, action items and owner.

Each click sends one email. The Zap doesn't change the table.

## Ask the user

Each `REPLACE_…` value is set per person. Resolve the table to its ID with the user's own Zapier Tables connection; don't ask them to paste an ID you can look up.

| Setting       | Where                                                            | What goes there                                                                                                                                 |
| ------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `TABLE_ID`    | `config.ts`, and `table_id` in `triggers/button-click-record.ts` | The meeting minutes table: ask which table it is, then look up its ID with the user's Zapier Tables connection. Use the same ID in both places. |
| `RECAP_EMAIL` | `config.ts`                                                      | Who gets the recap: the user's own address, a shared inbox, or a comma-separated list of attendees                                              |

Also confirm the table has the template's columns, in this order: Date, Meeting Title, Attendees, Key Points, Decisions Made, Action Items, Owner, and a "Send Recap" button. The field keys in `config.ts` (`f1`–`f7`, and the button at `data__f8`) match the template's table; if the user built their own table, look up each key with their Zapier Tables connection instead.

## Build it

Build with Zapier MCP. If the user wants the Zap kept in their project, copy this folder into `zaps/` there first, then deploy those files. No Zapier MCP tools? Read https://docs.zapier.com/mcp/get-started/quickstart.md and follow the page for the app you are running in to get the user connected, then continue with this build.

1. **Trigger:** `zapier-tables`, `button_click_record`, bound to the `zapier-tables` account (`triggers/button-click-record.ts`). Set `table_id` and `field_data_key` from the answers above.
2. **Accounts:** bind `zapier-tables` to the user's Zapier Tables connection for the account that owns the minutes table, and `email` to the user's Email by Zapier connection (`connections/email.ts`).
3. **Source:** publish `workflow.ts` and `config.ts`, with each `REPLACE_…` replaced by the user's answer.
4. **Build guide:** load Zapier's build guide with `get_zapier_skill("zapier:build-workflows")` and follow it to create and publish the workflow.
5. **Fields:** inspect the trigger's record fields and the Email by Zapier `outbound` action with the user's connections before the first test run. Fix any key in `workflow.ts` or `config.ts` that doesn't match.

## Test it

Run this sample as a draft test (`run_workflow_draft` in Zapier MCP) against a test row the user created for this, with the recap address set to the user's own email:

```json
{
  "record_id": "rec_install_test_1",
  "new": {
    "data": {
      "f1": "11/16/26",
      "f2": "[install-test] Weekly planning",
      "f3": "Test User, Sample Attendee",
      "f4": "Launch date moved to December.",
      "f5": "Approved the revised budget.",
      "f6": "Send the updated plan by Friday.",
      "f7": "Test User"
    }
  }
}
```

Check that one email arrives at the recap address with the values above in its body. The user deletes the test row, not the agent.

## Notes

- The template's original Zap emailed the record's creator. A button trigger doesn't reliably deliver the clicker's address, so the recap goes to `RECAP_EMAIL`. To reach every attendee, put their addresses in that list, or add one email step per attendee.
- The Email by Zapier action sends from a zapiermail.com address and is limited to 10 emails per hour on paid Zapier plans.
- Never commit a real email address or table ID.
