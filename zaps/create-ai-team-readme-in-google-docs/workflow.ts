import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  DRIVE_FOLDER_ID,
  ORG_DOMAIN,
  TEMPLATE_TITLE,
  AI_MODEL,
  MANAGER_DM_DELAY_BUSINESS_DAYS,
  EMAIL_COLUMN,
  LOCATION_COLUMN,
  TIME_ZONE_COLUMN,
  WORKING_HOURS_COLUMN,
  THOUGHT_COLUMN,
  SCHEDULE_COLUMN,
  REPLY_TIMES_COLUMN,
  SYNC_ASYNC_COLUMN,
  EMOTIONAL_ENERGY_COLUMN,
  SELF_CARE_COLUMN,
  ASSERTIVENESS_COLUMN,
  INSISTENCE_COLUMN,
  RESTLESSNESS_COLUMN,
  SOCIAL_USUAL_COLUMN,
  EMOTIONAL_USUAL_COLUMN,
  SELF_CARE_USUAL_COLUMN,
  INSISTENCE_USUAL_COLUMN,
  WRITING_SAMPLE_COLUMN,
  SUMMARY_COLUMN,
} from "./config.ts";
import { addBusinessDays } from "./lib/business-days.ts";
import {
  SUMMARY_PROMPT,
  SOCIAL_PROMPT,
  RELATIONSHIPS_PROMPT,
  SCHEDULE_PROMPT,
  COMMUNICATION_PROMPT,
  STRUCTURE_PROMPT,
  FEEDBACK_PROMPT,
} from "./lib/readme-prompts.ts";

const sdk = createZapierSdk();

type Row = Record<string, unknown>;

// The new survey row as the Zapier Tables trigger delivers it. Answers are keyed by column.
const InputSchema = z
  .object({
    record_id: z.string(),
    new: z.object({ data: z.record(z.string(), z.unknown()) }).loose(),
  })
  .loose();

// One AI step per ReadMe section. Each key in `fields` is the step's input label; its value is the table column the answer comes from.
const SECTIONS = [
  {
    name: "summary",
    instructions: SUMMARY_PROMPT,
    fields: {
      Thought: THOUGHT_COLUMN,
      Schedule: SCHEDULE_COLUMN,
      "Self Care": SELF_CARE_COLUMN,
      Insistence: INSISTENCE_COLUMN,
      "Sync Async": SYNC_ASYNC_COLUMN,
      "Reply Times": REPLY_TIMES_COLUMN,
      Restlessness: RESTLESSNESS_COLUMN,
      Assertiveness: ASSERTIVENESS_COLUMN,
      "SelfC - Usual": SELF_CARE_USUAL_COLUMN,
      "Social - Usual": SOCIAL_USUAL_COLUMN,
      "Emotional Energy": EMOTIONAL_ENERGY_COLUMN,
      "Emotional - Usual": EMOTIONAL_USUAL_COLUMN,
      "Insistence - Usual": INSISTENCE_USUAL_COLUMN,
    },
  },
  {
    name: "social",
    instructions: SOCIAL_PROMPT,
    fields: {
      "Sync Async": SYNC_ASYNC_COLUMN,
      "Social - Usual": SOCIAL_USUAL_COLUMN,
    },
  },
  {
    name: "relationships",
    instructions: RELATIONSHIPS_PROMPT,
    fields: {
      "Emotional Energy": EMOTIONAL_ENERGY_COLUMN,
      "Emotional - Usual": EMOTIONAL_USUAL_COLUMN,
    },
  },
  {
    name: "schedule",
    instructions: SCHEDULE_PROMPT,
    fields: {
      Schedule: SCHEDULE_COLUMN,
      "Reply Times": REPLY_TIMES_COLUMN,
      Restlessness: RESTLESSNESS_COLUMN,
    },
  },
  {
    name: "communication",
    instructions: COMMUNICATION_PROMPT,
    fields: {
      "Self Care": SELF_CARE_COLUMN,
      "SelfC - Usual": SELF_CARE_USUAL_COLUMN,
    },
  },
  {
    name: "structure",
    instructions: STRUCTURE_PROMPT,
    fields: {
      Insistence: INSISTENCE_COLUMN,
      Assertiveness: ASSERTIVENESS_COLUMN,
    },
  },
  {
    name: "feedback",
    instructions: FEEDBACK_PROMPT,
    fields: {
      "Sync Async": SYNC_ASYNC_COLUMN,
    },
  },
] as const;

const first = (result: { data: unknown[] }): Row =>
  (result.data[0] ?? {}) as Row;

const answer = (data: Row, column: string): string =>
  String(data[column] ?? "");

const workflow = defineDurable(
  "create-ai-team-readme-in-google-docs",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const data = input.new.data;
    const id = input.record_id;

    const employeeEmail = answer(data, EMAIL_COLUMN);
    const startedAt = await ctx.step(`capture-started-at-${id}`, async () =>
      new Date().toISOString(),
    );

    const employee = first(
      await ctx.step(`find-employee-${id}`, async () =>
        sdk.runAction({
          appKey: "bamboohr",
          actionType: "search",
          actionKey: "employeeSearch",
          connection: "bamboohr",
          inputs: { search_by: "email", search_term: employeeEmail },
        }),
      ),
    );
    if (!employee.id) {
      return { skipped: true, reason: "employee-not-found", record_id: id };
    }

    const employeeSlack = first(
      await ctx.step(`find-employee-slack-${id}`, async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "search",
          actionKey: "user_by_email",
          connection: "slack",
          inputs: { email: employeeEmail },
        }),
      ),
    );
    const employeeSlackId = String(employeeSlack.id ?? "");

    const sample = first(
      await ctx.step(`find-writing-sample-${id}`, async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "search",
          actionKey: "message",
          connection: "slack",
          inputs: {
            query: `from:${employeeSlackId}`,
            sort_by: "score",
            sort_dir: "desc",
          },
        }),
      ),
    );
    const writingSample = String(sample.text ?? "");

    const drafts: Record<string, string> = {};
    for (const section of SECTIONS) {
      const result = first(
        await ctx.step(`draft-${section.name}-${id}`, async () =>
          sdk.runAction({
            appKey: "ai",
            actionType: "write",
            actionKey: "get_completion",
            connection: "ai",
            inputs: {
              model_id: AI_MODEL,
              authentication_id: "0",
              includeWorkflowData: false,
              instructions: section.instructions,
              inputFields: {
                ...Object.fromEntries(
                  Object.entries(section.fields).map(([label, column]) => [
                    label,
                    answer(data, column),
                  ]),
                ),
                "writing sample": writingSample,
              },
              outputFields: [],
            },
          }),
        ),
      );
      drafts[section.name] = String(result.output ?? "");
    }

    const template = first(
      await ctx.step(`find-template-${id}`, async () =>
        sdk.runAction({
          appKey: "google-docs",
          actionType: "search",
          actionKey: "document",
          connection: "google-docs",
          inputs: { title: TEMPLATE_TITLE },
        }),
      ),
    );

    const doc = first(
      await ctx.step(`create-readme-doc-${id}`, async () =>
        sdk.runAction({
          appKey: "google-docs",
          actionType: "write",
          actionKey: "create_from_template",
          connection: "google-docs",
          inputs: {
            file: String(template.id ?? ""),
            title: `${String(employee.fullName1 ?? "")} ReadMe`,
            folder: DRIVE_FOLDER_ID,
            domain: ORG_DOMAIN,
            sharing_preference: "reader",
            empty_fields_preference: "keep",
            template_field__Name: String(employee.fullName1 ?? ""),
            template_field__SlackProfile: String(employeeSlack.name ?? ""),
            template_field__Location: answer(data, LOCATION_COLUMN),
            template_field__TimeZone: answer(data, TIME_ZONE_COLUMN),
            template_field__Workinghours: answer(data, WORKING_HOURS_COLUMN),
            template_field__Thought: answer(data, THOUGHT_COLUMN),
            template_field__Schedule: answer(data, SCHEDULE_COLUMN),
            template_field__ReplyTimes: answer(data, REPLY_TIMES_COLUMN),
            template_field__Restlessness: answer(data, RESTLESSNESS_COLUMN),
            template_field__EmotionalEnergy: answer(
              data,
              EMOTIONAL_ENERGY_COLUMN,
            ),
            template_field__SelfC: answer(data, SELF_CARE_COLUMN),
            template_field__SelfCU: answer(data, SELF_CARE_USUAL_COLUMN),
            template_field__Assertiveness: answer(data, ASSERTIVENESS_COLUMN),
            template_field__Insistence: answer(data, INSISTENCE_COLUMN),
            template_field__InsistenceU: answer(data, INSISTENCE_USUAL_COLUMN),
            template_field__SocialU: answer(data, SOCIAL_USUAL_COLUMN),
            template_field__EmotionalU: answer(data, EMOTIONAL_USUAL_COLUMN),
            template_field__Summary: drafts.summary,
            template_field__zTime: drafts.schedule,
            template_field__zSocial: drafts.social,
            template_field__zRelationships: drafts.relationships,
            template_field__zCommunication: drafts.communication,
            template_field__zStructure: drafts.structure,
            template_field__Feedback: drafts.feedback,
          },
        }),
      ),
    );
    const docId = String(doc.id ?? "");
    const docUrl = String(doc.alternateLink ?? "");

    await ctx.step(`update-table-row-${id}`, async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "update_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          record_id: id,
          [`new__data__${SUMMARY_COLUMN}`]: drafts.summary,
          [`new__data__${WRITING_SAMPLE_COLUMN}`]: writingSample,
        },
      }),
    );

    await ctx.step(`share-readme-doc-${id}`, async () =>
      sdk.runAction({
        appKey: "google-drive",
        actionType: "write",
        actionKey: "ae_51043_google_drive_share_file_or_folder_custom_",
        connection: "google-drive",
        inputs: {
          role: "writer",
          fileId: docId,
          emailAddress: employeeEmail,
          sendNotificationEmail: "false",
        },
      }),
    );

    await ctx.step(`dm-employee-${id}`, async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "direct_message",
        connection: "slack",
        inputs: {
          channel: employeeSlackId,
          text: `:tada: You generated a first draft of your ReadMe! You're on track to build productive working relationships.\n\n:todo-flag: Next steps\n1. <${docUrl}|*Edit it to be more accurate for you.*> You get to decide what to say about yourself!\n2. *Add to your Slack profile.* In your Slack profile, paste the link in the field "ReadMe."\n3. *Discuss in 1:1s.* In 3 days, your manager will receive a DM with a link to the draft. Use it in your next 1:1 to keep getting to know each other.\n4. *Share with your team.* You can use this template:\n_During onboarding I drafted my ReadMe. Take a look and let's talk through ours together!_`,
          as_bot: "yes",
          unfurl: "yes",
          link_names: "yes",
          send_multi: "no",
          add_edit_link: "no",
        },
      }),
    );

    const manager = first(
      await ctx.step(`find-manager-slack-${id}`, async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "search",
          actionKey: "user_by_email",
          connection: "slack",
          inputs: { email: String(employee.supervisorEmail ?? "") },
        }),
      ),
    );
    if (!manager.id) {
      return {
        skipped: true,
        reason: "manager-not-found",
        record_id: id,
        doc_id: docId,
      };
    }

    const postAt = await ctx.step(`schedule-manager-date-${id}`, async () =>
      addBusinessDays(startedAt, MANAGER_DM_DELAY_BUSINESS_DAYS),
    );

    await ctx.step(`schedule-manager-dm-${id}`, async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: String(manager.id),
          post_at: postAt,
          text: `Hi! Your direct report ${String(employee.fullName1 ?? "")} drafted <${docUrl}|their ReadMe>. *In your next 1:1, use their ReadMe to continue learning each other's workstyles.*\n\n:fyi: ReadMes are generated from a quick survey during onboarding and team events. Your direct report might not have edited theirs yet. Your next 1:1 is still the right time to ask questions like:\n1. How do you prefer to structure your work day?\n2. How do you like to receive constructive feedback?\n3. _And other questions based on what's drafted in their ReadMe._`,
          unfurl: "yes",
          link_names: "yes",
          add_edit_link: "no",
        },
      }),
    );

    return {
      record_id: id,
      doc_id: docId,
      url: docUrl,
      scheduled_manager_dm_at: postAt,
    };
  },
);

export default workflow;
