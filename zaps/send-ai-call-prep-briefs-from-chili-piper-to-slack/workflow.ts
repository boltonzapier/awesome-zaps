import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  MEETING_NAME_FIELD,
  MEETING_DATE_FIELD,
  PREP_BRIEF_FIELD,
  COMPANY_NAME_FIELD,
  ATTENDEE_FIELD,
  HOST_FIELD,
  HUBSPOT_ACCOUNT_ID,
  SLACK_USER_ID,
  MODEL,
  BRIEF_INSTRUCTIONS,
  SYNC_WAIT_SECONDS,
  BRIEF_LEAD_SECONDS,
} from "./config.ts";

const sdk = createZapierSdk();

// The meeting as the Chili Piper trigger delivers it. Only the email and start time are required.
const InputSchema = z
  .object({
    PersonEmail: z.string(),
    PersonFirstName: z.string().nullish(),
    PersonLastName: z.string().nullish(),
    meetingTitle: z.string().nullish(),
    meetingStartTime: z.union([z.string(), z.number()]),
    meetingLocation: z.string().nullish(),
    meetingDescription: z.string().nullish(),
    hostFullName: z.string().nullish(),
    assigneeFullName: z.string().nullish(),
    primaryGuestTimeZone: z.string().nullish(),
    additionalGuests: z.string().nullish(),
  })
  .loose();

type Row = Record<string, unknown>;

// Chili Piper's start time can arrive as Unix seconds or as an ISO timestamp.
function startMillis(value: string | number): number {
  if (typeof value === "number") return value * 1000;
  return /^\d+$/.test(value) ? Number(value) * 1000 : Date.parse(value);
}

function firstRow(result: { data: unknown[] }): Row {
  return (result.data[0] ?? {}) as Row;
}

// Blank values are written as "unknown" so the brief can say what it lacks.
function text(value: unknown): string {
  return value === undefined || value === null || value === ""
    ? "unknown"
    : String(value);
}

const workflow = defineDurable(
  "send-ai-call-prep-briefs-from-chili-piper-to-slack",
  async (ctx, rawInput) => {
    const meeting = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const startMs = startMillis(meeting.meetingStartTime);
    const email = meeting.PersonEmail;
    const emailDomain = email.slice(email.indexOf("@") + 1);
    const attendee = [meeting.PersonFirstName, meeting.PersonLastName]
      .filter(Boolean)
      .join(" ");

    await ctx.wait("wait-for-hubspot-contact", SYNC_WAIT_SECONDS);

    const contactResult = await ctx.step("find-hubspot-contact", async () =>
      sdk.runAction({
        appKey: "hubspot",
        actionType: "search",
        actionKey: "contactSearch",
        connection: "hubspot",
        inputs: {
          properties_to_retrieve: ["associatedcompanyid"],
          first_search_property_name: "email",
          first_search_property_value: email,
          _zap_search_success_on_miss: true,
        },
      }),
    );
    const contact = firstRow(contactResult);

    const companyResult = await ctx.step("find-hubspot-company", async () =>
      sdk.runAction({
        appKey: "hubspot",
        actionType: "search",
        actionKey: "company_crmSearch",
        connection: "hubspot",
        inputs: {
          properties_to_retrieve: [],
          first_search_property_name: "domain",
          first_search_property_value: emailDomain,
          _zap_search_success_on_miss: false,
        },
      }),
    );
    const company = firstRow(companyResult);

    const enrichmentResult = await ctx.step(
      "enrich-company-with-clearbit",
      async () =>
        sdk.runAction({
          appKey: "clearbit",
          actionType: "search",
          actionKey: "find_company_by_domain",
          connection: "clearbit",
          inputs: {
            domain: text(contact.hs_email_domain ?? emailDomain),
            _zap_search_success_on_miss: false,
          },
        }),
    );
    const enrichment = firstRow(enrichmentResult);

    const companyLink = company.hs_object_id
      ? `https://app.hubspot.com/contacts/${HUBSPOT_ACCOUNT_ID}/record/0-2/${text(company.hs_object_id)}`
      : "none";

    const briefInput = [
      `Meeting: ${text(meeting.meetingTitle)} at ${new Date(startMs).toISOString()}, time zone ${text(meeting.primaryGuestTimeZone)}, location ${text(meeting.meetingLocation)}`,
      `Description: ${text(meeting.meetingDescription)}`,
      `Guest: ${text(attendee)}, ${text(contact.jobtitle)} at ${text(contact.company)}, email ${email}`,
      `Additional guests: ${text(meeting.additionalGuests)}`,
      `Host: ${text(meeting.hostFullName)}; assigned to ${text(meeting.assigneeFullName)}`,
      `Contact location: ${[contact.city, contact.state, contact.country].filter(Boolean).join(", ") || "unknown"}; lifecycle stage ${text(contact.lifecyclestage)}`,
      `HubSpot company: phone ${text(company.phone)}, location ${[company.city, company.state, company.country].filter(Boolean).join(", ") || "unknown"}, annual revenue ${text(company.annualrevenue)}, employees ${text(company.numberofemployees)}, industry ${text(company.industry)}, type ${text(company.type)}, founded ${text(company.founded_year)}, description ${text(company.description)}, link ${companyLink}`,
      `Clearbit: sector ${text(enrichment["category__sector"])}, industry ${text(enrichment["category__industry"])}, estimated revenue ${text(enrichment["metrics__estimatedAnnualRevenue"])}, tech ${text(enrichment.tech)}, description ${text(enrichment.description)}`,
    ].join("\n");

    const briefResult = await ctx.step("write-call-prep-brief", async () =>
      sdk.runAction({
        appKey: "chatgpt",
        actionType: "write",
        actionKey: "conversation_responses_api",
        connection: "chatgpt",
        inputs: {
          model: MODEL,
          instructions: BRIEF_INSTRUCTIONS,
          user_message: briefInput,
          response_format: "text",
        },
      }),
    );
    const brief = String(
      (briefResult.data?.[0] as { output?: string } | undefined)?.output ?? "",
    ).trim();

    // A meeting booked with someone who is not in HubSpot has no contact to attach the note to.
    if (contact.id) {
      await ctx.step("log-brief-on-hubspot-contact", async () =>
        sdk.runAction({
          appKey: "hubspot",
          actionType: "write",
          actionKey: "create_engagement",
          connection: "hubspot",
          inputs: {
            type: "NOTE",
            body: brief,
            contactIds: [text(contact.id)],
          },
        }),
      );
    }

    await ctx.step("save-brief-to-meeting-table", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          [MEETING_NAME_FIELD]: meeting.meetingTitle ?? "",
          [MEETING_DATE_FIELD]: new Date(startMs).toISOString(),
          [PREP_BRIEF_FIELD]: brief,
          [COMPANY_NAME_FIELD]: text(contact.company),
          [ATTENDEE_FIELD]: attendee,
          [HOST_FIELD]: meeting.hostFullName ?? "",
        },
      }),
    );

    // The brief goes out the day before the meeting. A meeting less than a day away gets it now.
    const waitSeconds = await ctx.step("calculate-brief-delivery", async () =>
      Math.max(
        0,
        Math.round((startMs - BRIEF_LEAD_SECONDS * 1000 - Date.now()) / 1000),
      ),
    );
    await ctx.wait("wait-until-day-before-meeting", waitSeconds);

    const sent = await ctx.step("send-brief-to-slack", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: SLACK_USER_ID,
          text: brief,
        },
      }),
    );

    return {
      meeting: meeting.meetingTitle ?? null,
      startsAt: new Date(startMs).toISOString(),
      contactFound: Boolean(contact.id),
      message: sent.data?.[0] ?? null,
    };
  },
);

export default workflow;
