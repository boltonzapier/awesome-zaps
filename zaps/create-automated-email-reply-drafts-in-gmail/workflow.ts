import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  CALENDAR_ID,
  SENT_MAIL_QUERY,
  CALENDAR_LOOKAHEAD,
  MEETING_TIME_ZONE,
  MODEL_ID,
} from "./config.ts";

const sdk = createZapierSdk();

const INSTRUCTIONS = `You draft a reply to an email the user just received, written in the user's own voice. The user reviews every draft before anything is sent, so write it as if it will go out unchanged.

Use the sample of the user's sent emails to match their tone, sentence length, greetings, sign-offs and emoji use. Do not copy their content.

Use web_search and web_scrape only to learn about the sender and their company, and to find a resource the sender asks for. Link to a page only after you have read it; search results alone do not show what a page says.

Rules:
- If the email is automated, such as a calendar invitation, a receipt or a confirmation, return exactly NO_REPLY and nothing else.
- If the email is a sales pitch or asks for a call to sell something, politely decline in one or two sentences.
- If the sender asks to meet, use the calendar events to propose two or three specific times in the next few working days, in ${MEETING_TIME_ZONE}, avoiding events already booked. Do not offer times the calendar does not support.
- If the sender asks for a resource, find it with web_search, read it, and link to the one that answers the question.
- If you need information you cannot find, say so in the reply instead of inventing it.
- If a tool you need fails, use the fail tool rather than writing a reply that implies you checked something.

Return only the reply body as simple HTML (paragraphs and line breaks), with no subject line and no signature block. Return NO_REPLY when the rules above say not to reply.`;

// The email as the Gmail trigger delivers it. Only the message ID is required, because the draft is attached to it.
const InputSchema = z
  .object({
    message_id: z.string(),
    subject: z.string().nullable().optional(),
    snippet: z.string().nullable().optional(),
    body_plain: z.string().nullable().optional(),
    from: z
      .object({
        name: z.string().nullable().optional(),
        email: z.string().nullable().optional(),
      })
      .loose()
      .nullable()
      .optional(),
    from__email: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "create-automated-email-reply-drafts-in-gmail",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const sentMail = await ctx.step("find-sent-mail", async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "search",
        actionKey: "message",
        connection: "gmail",
        inputs: { query: SENT_MAIL_QUERY },
      }),
    );

    const calendarEvents = await ctx.step("find-calendar-events", async () =>
      sdk.runAction({
        appKey: "google-calendar",
        actionType: "search",
        actionKey: "event_v2",
        connection: "google-calendar",
        inputs: {
          calendarid: CALENDAR_ID,
          start_time: CALENDAR_LOOKAHEAD,
          ordering: "startTime",
          expand_recurring: "true",
        },
      }),
    );

    const reply = await ctx.step("draft-reply-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: MODEL_ID,
          authentication_id: "0",
          instructions: INSTRUCTIONS,
          inputFields: {
            incoming_email: JSON.stringify({
              from: input.from ?? null,
              from_email: input.from__email ?? null,
              subject: input.subject ?? "",
              snippet: input.snippet ?? "",
              body: input.body_plain ?? "",
            }),
            sent_mail_sample: JSON.stringify(sentMail.data),
            calendar_events: JSON.stringify(calendarEvents.data),
          },
          includeWorkflowData: false,
          outputFields: [],
          tools: [
            {
              type: "builtin",
              id: "tool_web_search",
              builtin_tool_name: "web_search",
            },
            {
              type: "builtin",
              id: "tool_web_scrape",
              builtin_tool_name: "web_scrape",
            },
            { type: "builtin", id: "tool_fail", builtin_tool_name: "fail" },
          ],
        },
      }),
    );

    const result = (reply.data[0] ?? {}) as { output?: unknown };
    const body = String(result.output ?? "").trim();
    if (body === "NO_REPLY") {
      return {
        skipped: true,
        reason: "no-reply-needed",
        messageId: input.message_id,
      };
    }

    const draft = await ctx.step("create-reply-draft", async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "write",
        actionKey: "draft_v2_reply",
        connection: "gmail",
        inputs: {
          thread_id: input.message_id,
          body,
          body_type: "html",
        },
      }),
    );

    return {
      messageId: input.message_id,
      draft: draft.data[0] ?? null,
    };
  },
);

export default workflow;
