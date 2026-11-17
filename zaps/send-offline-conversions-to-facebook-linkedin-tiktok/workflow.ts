import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  CLOSED_WON_STAGE,
  CLOSED_WON_EVENT_NAME,
  FACEBOOK_BUSINESS_ID,
  FACEBOOK_PIXEL_ID,
  LINKEDIN_ACCOUNT_ID,
  LINKEDIN_CONVERSION_ID,
  TIKTOK_ADVERTISER_ID,
  TIKTOK_CRM_EVENT_SET_ID,
} from "./config.ts";

const sdk = createZapierSdk();

// The updated Salesforce opportunity as the Updated Record trigger delivers it.
const InputSchema = z
  .object({
    Id: z.string(),
    StageName: z.string().nullable().optional(),
    AccountId: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "send-offline-conversions-to-facebook-linkedin-tiktok",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const opportunityId = input.Id;

    if (input.StageName !== CLOSED_WON_STAGE) {
      return { skipped: true, reason: "not-closed-won", opportunityId };
    }
    const accountId = input.AccountId;
    if (!accountId) {
      return { skipped: true, reason: "no-account", opportunityId };
    }

    // Ad platforms match a conversion to a person by email, so the deal's contact is needed.
    const contactLookup = await ctx.step(
      `find-salesforce-contact-${opportunityId}`,
      async () =>
        sdk.runAction({
          appKey: "salesforce",
          actionType: "search",
          actionKey: "find_record",
          connection: "salesforce",
          inputs: {
            object: "Contact",
            searchField: "AccountId",
            searchValue: accountId,
          },
        }),
    );
    const contact = contactLookup.data[0] as
      { Id?: string | null; Email?: string | null } | undefined;
    const contactId = contact?.Id ?? null;
    const email = (contact?.Email ?? "").trim().toLowerCase();
    if (!contactId || !email) {
      return { skipped: true, reason: "no-contact-email", opportunityId };
    }

    // Each platform gets the opportunity ID as its event ID, so a re-sent update is counted once.
    const linkedin = await ctx.step(
      `send-linkedin-conversion-${opportunityId}`,
      async () =>
        sdk.runAction({
          appKey: "linkedin-conversions",
          actionType: "write",
          actionKey: "create_conversion_event",
          connection: "linkedin-conversions",
          inputs: {
            account: LINKEDIN_ACCOUNT_ID,
            conversion: LINKEDIN_CONVERSION_ID,
            email,
            event_id: opportunityId,
          },
        }),
    );

    const facebook = await ctx.step(
      `send-facebook-conversion-${opportunityId}`,
      async () =>
        sdk.runAction({
          appKey: "facebook-conversions",
          actionType: "write",
          actionKey: "send_lead_event",
          connection: "facebook-conversions",
          inputs: {
            business: FACEBOOK_BUSINESS_ID,
            event_destination: FACEBOOK_PIXEL_ID,
            email,
            event_id: opportunityId,
            content_id: CLOSED_WON_EVENT_NAME,
            external_id: contactId,
            action_source: "Other",
            show_additional_user_data: false,
          },
        }),
    );

    const tiktok = await ctx.step(
      `send-tiktok-conversion-${opportunityId}`,
      async () =>
        sdk.runAction({
          appKey: "tiktok-conversion",
          actionType: "write",
          actionKey: "send_event",
          connection: "tiktok-conversion",
          inputs: {
            advertiser_id: TIKTOK_ADVERTISER_ID,
            crm_event_set_id: TIKTOK_CRM_EVENT_SET_ID,
            crm_name: "Salesforce",
            event: CLOSED_WON_EVENT_NAME,
            email,
          },
        }),
    );

    return {
      opportunityId,
      contactId,
      sent: {
        linkedin: linkedin.data[0] ?? null,
        facebook: facebook.data[0] ?? null,
        tiktok: tiktok.data[0] ?? null,
      },
    };
  },
);

export default workflow;
