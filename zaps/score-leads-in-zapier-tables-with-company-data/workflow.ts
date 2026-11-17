import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  EMAIL_FIELD,
  COMPANY_DOMAIN_FIELD,
  IS_STUDENT_FIELD,
  SEGMENT_FIELD,
  SCORE_FIELD,
  TOP_SIGNALS_FIELD,
  GRADE_FIELD,
  COMPANY_NAME_FIELD,
  COMPANY_STATE_FIELD,
  COMPANY_STATE_CODE_FIELD,
  COMPANY_COUNTRY_FIELD,
  COMPANY_EMPLOYEES_FIELD,
  COMPANY_INDUSTRY_FIELD,
  GRADE_PLACEHOLDER,
  GRADE_STAR,
} from "./config.ts";

const sdk = createZapierSdk();

// The new record as the Zapier Tables trigger delivers it. The record's values sit under new.data, keyed by field key.
const InputSchema = z
  .object({
    record_id: z.union([z.string(), z.number()]),
    new: z
      .object({
        data: z.record(z.string(), z.unknown()).nullable().optional(),
      })
      .loose()
      .nullable()
      .optional(),
  })
  .loose();

// The person and company fields the lead scorer returns; each one may be missing.
type LeadPerson = {
  properties?: {
    is_student?: boolean | null;
    customer_fit?: {
      segment?: string | null;
      score?: number | null;
      top_signals?: string | null;
      grade_emoji?: string | null;
    } | null;
  } | null;
  company?: {
    properties?: {
      domain?: string | null;
      name?: string | null;
      industry?: string | null;
      number_of_employees?: number | null;
      location?: {
        state?: string | null;
        state_code?: string | null;
        country?: string | null;
      } | null;
    } | null;
  } | null;
};

const workflow = defineDurable(
  "score-leads-in-zapier-tables-with-company-data",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const recordId = String(input.record_id);
    const email = String(input.new?.data?.[EMAIL_FIELD] ?? "").trim();

    if (!email) {
      return { skipped: true, reason: "no-email", recordId };
    }

    const lookup = await ctx.step("find-lead-person", async () =>
      sdk.runAction({
        appKey: "lead-information",
        actionType: "search",
        actionKey: "find_person",
        inputs: { email },
      }),
    );

    // A miss means the scorer knows nothing about this address, so the record keeps its blank fields.
    const person = lookup.data[0] as LeadPerson | undefined;
    if (!person) {
      return { skipped: true, reason: "no-person-match", recordId, email };
    }

    const fit = person.properties?.customer_fit;
    const company = person.company?.properties;

    const grade = await ctx.step("replace-grade-stars", async () =>
      sdk.runAction({
        appKey: "formatter",
        actionType: "write",
        actionKey: "text_line_item",
        inputs: {
          transform: "string.replace",
          inputs: fit?.grade_emoji ?? "",
          old: GRADE_PLACEHOLDER,
          new: GRADE_STAR,
        },
      }),
    );
    const gradeStars = String(
      (grade.data?.[0] as { output?: string } | undefined)?.output ?? "",
    );

    const update = await ctx.step("write-lead-score-to-record", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "update_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          record_id: recordId,
          [COMPANY_DOMAIN_FIELD]: company?.domain ?? "",
          [IS_STUDENT_FIELD]: person.properties?.is_student ?? null,
          [SEGMENT_FIELD]: fit?.segment ?? "",
          [SCORE_FIELD]: fit?.score ?? null,
          [TOP_SIGNALS_FIELD]: fit?.top_signals ?? "",
          [GRADE_FIELD]: gradeStars,
          [COMPANY_NAME_FIELD]: company?.name ?? "",
          [COMPANY_STATE_FIELD]: company?.location?.state ?? "",
          [COMPANY_STATE_CODE_FIELD]: company?.location?.state_code ?? "",
          [COMPANY_COUNTRY_FIELD]: company?.location?.country ?? "",
          [COMPANY_EMPLOYEES_FIELD]: company?.number_of_employees ?? null,
          [COMPANY_INDUSTRY_FIELD]: company?.industry ?? "",
        },
      }),
    );

    return {
      recordId,
      email,
      score: fit?.score ?? null,
      grade: gradeStars,
      updated: update.data?.[0] ?? null,
    };
  },
);

export default workflow;
