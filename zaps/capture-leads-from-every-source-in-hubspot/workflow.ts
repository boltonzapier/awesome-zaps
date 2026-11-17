import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { clean, employeesRange, splitName } from "./lib/normalize.ts";

// HubSpot's job-role values. The role classification step must return one of these, or nothing.
const ROLE_CATEGORIES = [
  "accounting",
  "administrative",
  "business_development",
  "communications",
  "consulting",
  "customer_service",
  "design",
  "education",
  "entrepreneurship",
  "finance",
  "health_professional",
  "human_resources",
  "information_technology",
  "legal",
  "marketing",
  "operations",
  "product",
  "project_management",
  "public_relations",
  "quality_assurance",
  "real_estate",
  "recruiting",
  "research",
  "sales",
  "support",
  "retired",
];

// HubSpot's seniority values. The seniority classification step must return one of these, or nothing.
const SENIORITY_LEVELS = [
  "vp",
  "director",
  "entry",
  "executive",
  "manager",
  "owner",
  "partner",
  "senior",
  "employee",
];

// Model for both classification steps, on Zapier-managed credentials ("0").
const AI_MODEL = "openai/gpt-4o-mini";

const sdk = createZapierSdk();

// Each lead source posts these keys to the catch hook. Every field is optional except the email, which HubSpot matches on.
const InputSchema = z
  .object({
    email: z.string().nullish(),
    first_name: z.string().nullish(),
    last_name: z.string().nullish(),
    full_name: z.string().nullish(),
    job_title: z.string().nullish(),
    employment_role: z.string().nullish(),
    employment_seniority: z.string().nullish(),
    company_name: z.string().nullish(),
    number_of_employees: z.string().nullish(),
    phone_number: z.string().nullish(),
    linkedin_url: z.string().nullish(),
    message: z.string().nullish(),
    source: z.string().nullish(),
  })
  .loose();

// The AI output is a named field on the first returned row.
function firstOutput(result: { data: unknown[] }, name: string): string {
  const row = (result.data[0] ?? {}) as Record<string, string | undefined>;
  return row[name] ?? "";
}

const workflow = defineDurable(
  "capture-leads-from-every-source-in-hubspot",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const email = clean(input.email);
    if (!email) {
      return {
        skipped: true,
        reason: "no-email",
        source: input.source ?? null,
      };
    }

    const { firstName, lastName } = splitName(
      input.first_name,
      input.last_name,
      input.full_name,
    );
    const numEmployees = employeesRange(input.number_of_employees);
    const role = clean(input.employment_role);
    const seniority = clean(input.employment_seniority);

    const roleResult = role
      ? await ctx.step("classify-employment-role", async () =>
          sdk.runAction({
            appKey: "ai",
            actionType: "write",
            actionKey: "get_completion",
            inputs: {
              model_id: AI_MODEL,
              provider_id: "openai",
              authentication_id: "0",
              includeWorkflowData: false,
              instructions: `You are a job classification expert. Return the single best matching category from the list below, in lowercase. Return nothing if the role is blank.\n\nCategories:\n${ROLE_CATEGORIES.join("\n")}\n\nRole: ${role}`,
              outputFields: [
                {
                  name: "Standardized Employment Role",
                  type: "text",
                  isRequired: true,
                },
              ],
            },
          }),
        )
      : null;
    const hsRole = roleResult
      ? firstOutput(roleResult, "Standardized Employment Role")
      : "";

    const seniorityResult = seniority
      ? await ctx.step("classify-employment-seniority", async () =>
          sdk.runAction({
            appKey: "ai",
            actionType: "write",
            actionKey: "get_completion",
            inputs: {
              model_id: AI_MODEL,
              provider_id: "openai",
              authentication_id: "0",
              includeWorkflowData: false,
              instructions: `You are a job seniority classification expert. Return the single best matching level from the list below, in lowercase. Return nothing if the input is blank.\n\nLevels:\n${SENIORITY_LEVELS.join("\n")}\n\nSeniority input: ${seniority}`,
              outputFields: [
                {
                  name: "Standardized Employment Seniority",
                  type: "text",
                  isRequired: true,
                },
              ],
            },
          }),
        )
      : null;
    const hsSeniority = seniorityResult
      ? firstOutput(seniorityResult, "Standardized Employment Seniority")
      : "";

    const upsert = await ctx.step("upsert-hubspot-contact", async () =>
      sdk.runAction({
        appKey: "hubspot",
        actionType: "write",
        actionKey: "upsert_contact",
        connection: "hubspot",
        inputs: {
          email,
          firstname: firstName,
          lastname: lastName,
          company: clean(input.company_name),
          jobtitle: clean(input.job_title),
          phone: clean(input.phone_number),
          hs_linkedin_url: clean(input.linkedin_url),
          message: clean(input.message),
          hs_role: hsRole,
          hs_seniority: hsSeniority,
          numemployees: numEmployees,
        },
      }),
    );

    return {
      email,
      source: input.source ?? null,
      contact: upsert.data[0] ?? null,
    };
  },
);

export default workflow;
