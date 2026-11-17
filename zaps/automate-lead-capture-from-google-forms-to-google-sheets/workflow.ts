import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  CRM_WORKSHEET_ID,
  INCOMPLETE_WORKSHEET_ID,
  FORM_QUESTIONS,
  COLUMNS,
  COMPANY_INTRO,
  BOOKING_LINK,
  SALES_EMAIL,
  CALENDAR_ID,
  FOLLOW_UP_HOURS,
  FOLLOW_UP_MINUTES,
} from "./config.ts";

const sdk = createZapierSdk();

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

// A Google Forms response: each answer is keyed by its question title, and any answer may be missing.
const InputSchema = z.record(z.string(), z.unknown());

type Lead = {
  name: string;
  email: string;
  phone: string;
  company: string;
  source: string;
};

function answer(input: Record<string, unknown>, question: string): string {
  const value = input[question];
  return typeof value === "string" ? value.trim() : "";
}

function sheetRow(
  lead: Lead,
  submittedAt: string,
  status: string,
  leadScore: string,
  followUpAt: string,
) {
  return {
    [COLUMNS.submittedAt]: submittedAt,
    [COLUMNS.name]: lead.name,
    [COLUMNS.email]: lead.email,
    [COLUMNS.phone]: lead.phone,
    [COLUMNS.company]: lead.company,
    [COLUMNS.source]: lead.source,
    [COLUMNS.status]: status,
    [COLUMNS.leadScore]: leadScore,
    [COLUMNS.followUpAt]: followUpAt,
  };
}

function welcomeBody(name: string): string {
  return [
    `Hi ${name},`,
    "",
    "Thank you for getting in touch. We have your details and will follow up soon.",
    "",
    COMPANY_INTRO,
    "",
    `To book a consultation or demo, use this link: ${BOOKING_LINK}`,
    "",
    "Next, a member of our team reviews your request and confirms the next steps with you.",
  ].join("\n");
}

function salesAlertBody(lead: Lead, submittedAt: string): string {
  return [
    `New lead submitted at ${submittedAt}.`,
    "",
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    `Company: ${lead.company}`,
    `Lead source: ${lead.source}`,
    "",
    "A follow-up reminder is on the calendar for the follow-up time set in config.ts.",
  ].join("\n");
}

const workflow = defineDurable(
  "automate-lead-capture-from-google-forms-to-google-sheets",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const lead: Lead = {
      name: answer(input, FORM_QUESTIONS.name),
      email: answer(input, FORM_QUESTIONS.email),
      phone: answer(input, FORM_QUESTIONS.phone),
      company: answer(input, FORM_QUESTIONS.company),
      source: answer(input, FORM_QUESTIONS.source),
    };

    const timing = await ctx.step("capture-submission-time", async () => {
      const submitted = Date.now();
      const followUpStart = submitted + FOLLOW_UP_HOURS * HOUR_MS;
      return {
        submittedAt: new Date(submitted).toISOString(),
        followUpAt: new Date(followUpStart).toISOString(),
        followUpEndAt: new Date(
          followUpStart + FOLLOW_UP_MINUTES * MINUTE_MS,
        ).toISOString(),
      };
    });

    // A failed step is recorded and the rest still run, so one bad action never loses the lead.
    const errors: string[] = [];
    const attempt = async (name: string, run: () => Promise<unknown>) => {
      try {
        await ctx.step(name, run);
      } catch (error) {
        errors.push(
          `${name}: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    };

    if (!lead.name || !lead.email) {
      await attempt("log-incomplete-lead-row", async () =>
        sdk.runAction({
          appKey: "google-sheets",
          actionType: "write",
          actionKey: "add_row",
          connection: "google-sheets",
          inputs: {
            spreadsheet: SPREADSHEET_ID,
            worksheet: INCOMPLETE_WORKSHEET_ID,
            ...sheetRow(lead, timing.submittedAt, "Incomplete", "", ""),
          },
        }),
      );
      return { status: "incomplete", submittedAt: timing.submittedAt, errors };
    }

    await attempt("log-lead-row", async () =>
      sdk.runAction({
        appKey: "google-sheets",
        actionType: "write",
        actionKey: "add_row",
        connection: "google-sheets",
        inputs: {
          spreadsheet: SPREADSHEET_ID,
          worksheet: CRM_WORKSHEET_ID,
          ...sheetRow(
            lead,
            timing.submittedAt,
            "New Lead",
            "Cold",
            timing.followUpAt,
          ),
        },
      }),
    );

    await attempt("send-welcome-email", async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "write",
        actionKey: "message",
        connection: "gmail",
        inputs: {
          to: lead.email,
          subject: `Thanks for your interest, ${lead.name}`,
          body: welcomeBody(lead.name),
          body_type: "plain",
        },
      }),
    );

    await attempt("create-follow-up-reminder", async () =>
      sdk.runAction({
        appKey: "google-calendar",
        actionType: "write",
        actionKey: "detailed_event",
        connection: "google-calendar",
        inputs: {
          calendarid: CALENDAR_ID,
          summary: `Follow up with ${lead.name}`,
          description: salesAlertBody(lead, timing.submittedAt),
          start__dateTime: timing.followUpAt,
          end__dateTime: timing.followUpEndAt,
          transparency: "opaque",
          visibility: "private",
        },
      }),
    );

    await attempt("notify-sales-team", async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "write",
        actionKey: "message",
        connection: "gmail",
        inputs: {
          to: SALES_EMAIL,
          subject: `New lead: ${lead.name}`,
          body: salesAlertBody(lead, timing.submittedAt),
          body_type: "plain",
        },
      }),
    );

    return {
      status: "captured",
      email: lead.email,
      submittedAt: timing.submittedAt,
      errors,
    };
  },
);

export default workflow;
