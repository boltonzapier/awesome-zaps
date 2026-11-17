import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  GONG_API_BASE_URL,
  AI_MODEL_ID,
  AI_AUTHENTICATION_ID,
  TASK_SUBJECT,
  TASK_DUE_HOURS,
} from "./config.ts";
import {
  organizerEmail,
  recipients,
  attendeeList,
  readableScript,
  gmailDraftUrl,
  type CallsPayload,
} from "./lib/follow-up.ts";

const sdk = createZapierSdk();

const EMAIL_INSTRUCTIONS = `# Role
You are an expert sales communications specialist writing the follow-up email a rep sends after a call.

# Instructions
Read the call transcript and the attendee list, then write:
- Email Subject: under 50 characters, naming the prospect's company or the topic discussed.
- Email Body: plain text, addressed to the recipient by first name. Open by thanking them and referring to something specific they said. Recap two or three key points. Then list next steps in two groups, "From our side:" and "From your side:", each item as "- [action] - [owner] by [date or timing]". Propose a concrete next meeting time if one came up. Close with the host's name. Keep paragraphs to two or three sentences. Do not invent commitments the call did not contain.
- Call Summary: two or three sentences on the main discussion points, challenges and agreed solutions.`;

const EMAIL_OUTPUT_FIELDS = [
  { name: "Email Subject", type: "text", isRequired: true },
  { name: "Email Body", type: "text", isRequired: true },
  { name: "Call Summary", type: "text", isRequired: true },
];

const InputSchema = z
  .object({
    callData: z
      .object({
        metaData: z
          .object({
            id: z.string(),
            title: z.string().nullable().optional(),
          })
          .loose(),
      })
      .loose(),
  })
  .loose();

const workflow = defineDurable(
  "draft-follow-up-emails-from-gong-calls-to-hubspot",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const callId = input.callData.metaData.id;
    const title = input.callData.metaData.title ?? "your call";

    const rawTranscript = await ctx.step("fetch-gong-transcript", async () => {
      const response = await sdk.fetch(
        `${GONG_API_BASE_URL}/v2/calls/transcript`,
        {
          connection: "gong",
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ filter: { callIds: [callId] } }),
        },
      );
      if (!response.ok) {
        throw new Error(`Gong returned ${response.status} for the transcript`);
      }
      return response.text();
    });

    // Parties, the organizer and the interaction details come from the extensive call record.
    const rawDetails = await ctx.step("fetch-gong-call-details", async () => {
      const response = await sdk.fetch(
        `${GONG_API_BASE_URL}/v2/calls/extensive`,
        {
          connection: "gong",
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({
            filter: { callIds: [callId] },
            contentSelector: {
              context: "Extended",
              contextTiming: ["Now"],
              exposedFields: {
                parties: true,
                content: {
                  structure: false,
                  topics: false,
                  trackers: false,
                  trackerOccurrences: false,
                  pointsOfInterest: false,
                  brief: false,
                  outline: false,
                  highlights: false,
                  callOutcome: false,
                  keyPoints: false,
                },
                interaction: {
                  speakers: true,
                  video: true,
                  personInteractionStats: true,
                  questions: true,
                },
                collaboration: { publicComments: false },
                media: false,
              },
            },
          }),
        },
      );
      if (!response.ok) {
        throw new Error(
          `Gong returned ${response.status} for the call-details`,
        );
      }
      return response.text();
    });

    const details = JSON.parse(rawDetails) as CallsPayload;
    const call = details.calls?.[0] ?? {};

    const organizer = organizerEmail(call);
    if (!organizer) {
      return { skipped: true, reason: "no-organizer", callId };
    }
    const people = recipients(call);
    if (!people) {
      return { skipped: true, reason: "no-external-recipient-or-host", callId };
    }

    const owner = await ctx.step("find-hubspot-owner", async () =>
      sdk.runAction({
        appKey: "hubspot",
        actionType: "search",
        actionKey: "find_owner_by_email",
        connection: "hubspot",
        inputs: { owner_email: organizer },
      }),
    );
    const ownerId = (owner.data[0] as { id?: string } | undefined)?.id;
    if (!ownerId) {
      return { skipped: true, reason: "owner-not-in-hubspot", callId };
    }

    const slackUser = await ctx.step("find-organizer-in-slack", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "search",
        actionKey: "user_by_email",
        connection: "slack",
        inputs: { email: organizer },
      }),
    );
    const slackUserId = (slackUser.data[0] as { id?: string } | undefined)?.id;
    if (!slackUserId) {
      return { skipped: true, reason: "organizer-not-in-slack", callId };
    }

    const transcript = readableScript(rawTranscript, call);

    const draft = await ctx.step("draft-follow-up-email-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: AI_MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: EMAIL_INSTRUCTIONS,
          inputFields: {
            transcript,
            attendees: attendeeList(call),
            recipient: `${people.to.name ?? ""} <${people.to.emailAddress}>`,
            host: people.host.name ?? "",
          },
          includeWorkflowData: false,
          outputFields: EMAIL_OUTPUT_FIELDS,
        },
      }),
    );
    const generated = (draft.data[0] ?? {}) as Record<string, unknown>;
    const subject = String(generated["Email Subject"] ?? "").trim();
    const body = String(generated["Email Body"] ?? "").trim();
    const summary = String(generated["Call Summary"] ?? "").trim();

    const draftUrl = gmailDraftUrl(people.to.emailAddress, subject, body);
    const dueAt = new Date(
      Date.now() + TASK_DUE_HOURS * 60 * 60 * 1000,
    ).toISOString();

    const task = await ctx.step("create-hubspot-follow-up-task", async () =>
      sdk.runAction({
        appKey: "hubspot",
        actionType: "write",
        actionKey: "create_engagement",
        connection: "hubspot",
        inputs: {
          body: `Call Summary: ${summary}\n\nAccess Draft Email: ${draftUrl}`,
          type: "TASK",
          status: "WAITING",
          ownerId,
          subject: TASK_SUBJECT,
          timestamp: dueAt,
          haltIfAssociationsErrors: "false",
        },
      }),
    );
    const engagement = (
      task.data[0] as
        | { engagement?: { id?: string | number; portalId?: string | number } }
        | undefined
    )?.engagement;
    const taskUrl = `https://app.hubspot.com/tasks/${engagement?.portalId}/${engagement?.id}`;

    await ctx.step("dm-organizer-follow-up-kit", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "direct_message",
        connection: "slack",
        inputs: {
          channel: slackUserId,
          text: `*Your meeting follow-up kit for ${title} is ready*\n\n*Call summary:* ${summary}\n\n• <${draftUrl}|Open the email draft>\n• <${taskUrl}|Open the HubSpot task>\n\n*Subject:* ${subject}\n\n${body}\n\n_Open the email draft to review it and send it._`,
          as_bot: "yes",
          unfurl: "no",
          link_names: "yes",
          send_multi: "no",
          add_edit_link: "no",
        },
      }),
    );

    return {
      callId,
      recipient: people.to.emailAddress,
      cc: people.cc.map((p) => p.emailAddress),
      task: engagement?.id ?? null,
    };
  },
);

export default workflow;
