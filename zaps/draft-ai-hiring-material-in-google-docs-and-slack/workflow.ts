import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  TEMPLATE_DOC_ID,
  DEPARTMENT_FIELD,
  ROLE_TITLE_FIELD,
  ROLE_LEVEL_FIELD,
  LOCATION_FIELD,
  HIRING_MANAGER_EMAIL_FIELD,
  RECRUITER_EMAIL_FIELD,
  INTAKE_NOTES_FIELD,
  ABOUT_ROLE_FIELD,
  ABOUT_YOU_FIELD,
  THINGS_YOULL_DO_FIELD,
  APPLICATION_QUESTIONS_FIELD,
  INTERVIEW_QUESTIONS_FIELD,
  CHANNEL_FIELD,
  DOCUMENT_LINK_FIELD,
  FOLDER_ID,
  SHARING_PREFERENCE,
  MATERIAL_NOTE,
  MODEL_ID,
  AI_AUTHENTICATION_ID,
  TEMPLATE_FIELDS,
} from "./config.ts";
import { hiringChannelName } from "./lib/channel-name.ts";

const sdk = createZapierSdk();

// The tracker record whose new-record trigger started the zap. Its fields are read by the keys in
// config.ts, so each one may be empty.
const InputSchema = z
  .object({
    record_id: z.union([z.string(), z.number()]),
  })
  .loose();

const INSTRUCTIONS = `You draft hiring material for one open role from the intake details given. Use only those details: never invent pay, benefits, company facts or anything about a named person. Write about_role as one short paragraph. Write about_you and things_youll_do as lines starting with "- ". Write application_questions and the three interview stages as one question per line with no numbering. Use the stage names recruiter_screen_questions, hiring_manager_questions and skills_questions. If the intake gives nothing for a field, return an empty string for it.`;

const OUTPUT_FIELDS = [
  "about_role",
  "about_you",
  "things_youll_do",
  "application_questions",
  "recruiter_screen_questions",
  "hiring_manager_questions",
  "skills_questions",
].map((name) => ({ name, type: "text", isRequired: true }));

const workflow = defineDurable(
  "draft-ai-hiring-material-in-google-docs-and-slack",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const recordId = String(input.record_id).trim();

    const lookup = await ctx.step("find-hiring-record", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "search",
        actionKey: "find_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          filter_count: "1",
          field_data_key: "id",
          operator: "exact",
          lookup_value: recordId,
        },
      }),
    );

    const match = lookup.data?.[0] as
      | {
          old?: {
            created_at?: string;
            data?: Record<string, string | null | undefined>;
          };
        }
      | undefined;
    const fields = match?.old?.data;
    if (!fields) {
      return { skipped: true, reason: "record-not-found", recordId };
    }
    const read = (key: string) => (fields[key] ?? "").trim();
    const roleTitle = read(ROLE_TITLE_FIELD);
    const department = read(DEPARTMENT_FIELD);
    const roleLevel = read(ROLE_LEVEL_FIELD);
    const location = read(LOCATION_FIELD);
    const intakeNotes = read(INTAKE_NOTES_FIELD);
    const hiringManagerEmail = read(HIRING_MANAGER_EMAIL_FIELD);
    const recruiterEmail = read(RECRUITER_EMAIL_FIELD);
    const createdAt = match?.old?.created_at ?? "";

    const completion = await ctx.step("draft-hiring-material", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: INSTRUCTIONS,
          inputFields: {
            role_title: roleTitle,
            department,
            role_level: roleLevel,
            location,
            intake_notes: intakeNotes,
          },
          includeWorkflowData: false,
          outputFields: OUTPUT_FIELDS,
        },
      }),
    );

    const draft = (completion.data[0] ?? {}) as Record<
      string,
      string | undefined
    >;
    const aboutRole = draft.about_role ?? "";
    const aboutYou = draft.about_you ?? "";
    const thingsYoullDo = draft.things_youll_do ?? "";
    const applicationQuestions = draft.application_questions ?? "";
    const recruiterScreen = draft.recruiter_screen_questions ?? "";
    const hiringManager = draft.hiring_manager_questions ?? "";
    const skills = draft.skills_questions ?? "";
    const interviewQuestions = [
      `Recruiter screen\n${recruiterScreen}`,
      `Hiring manager\n${hiringManager}`,
      `Skills\n${skills}`,
    ].join("\n\n");

    await ctx.step("save-drafts-to-record", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "update_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          record_id: recordId,
          [`new__data__${ABOUT_ROLE_FIELD}`]: aboutRole,
          [`new__data__${ABOUT_YOU_FIELD}`]: aboutYou,
          [`new__data__${THINGS_YOULL_DO_FIELD}`]: thingsYoullDo,
          [`new__data__${APPLICATION_QUESTIONS_FIELD}`]: applicationQuestions,
          [`new__data__${INTERVIEW_QUESTIONS_FIELD}`]: interviewQuestions,
        },
      }),
    );

    const document = await ctx.step("create-hiring-doc", async () =>
      sdk.runAction({
        appKey: "google-docs",
        actionType: "write",
        actionKey: "create_from_template",
        connection: "google-docs",
        inputs: {
          file: TEMPLATE_DOC_ID,
          title: `[BOT DRAFT] ${roleTitle} - ${department} - Hiring Material`,
          folder: FOLDER_ID,
          template_folder: FOLDER_ID,
          sharing_preference: SHARING_PREFERENCE,
          empty_fields_preference: "keep",
          [TEMPLATE_FIELDS.department]: department,
          [TEMPLATE_FIELDS.jobTitle]: roleTitle,
          [TEMPLATE_FIELDS.jobLevel]: roleLevel,
          [TEMPLATE_FIELDS.location]: location,
          [TEMPLATE_FIELDS.roleIntro]: aboutRole,
          [TEMPLATE_FIELDS.aboutYou]: aboutYou,
          [TEMPLATE_FIELDS.thingsYoullDo]: thingsYoullDo,
          [TEMPLATE_FIELDS.applicationQuestions]: applicationQuestions,
          [TEMPLATE_FIELDS.recruiterScreenQuestions]: recruiterScreen,
          [TEMPLATE_FIELDS.hiringManagerQuestions]: hiringManager,
          [TEMPLATE_FIELDS.skillsQuestions]: skills,
          [TEMPLATE_FIELDS.chatTranscript]: intakeNotes,
          [TEMPLATE_FIELDS.materialNote]: MATERIAL_NOTE,
        },
      }),
    );

    const doc = document.data[0] as
      { id?: string; alternateLink?: string } | undefined;
    if (!doc?.id || !doc.alternateLink) {
      throw new Error("Google Docs did not return a document ID and link");
    }

    const channelName = hiringChannelName(roleTitle, createdAt);
    const channel = await ctx.step("create-hiring-channel", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "new_channel",
        connection: "slack",
        inputs: { name: channelName },
      }),
    );
    const channelId = (
      channel.data[0] as { channel?: { id?: string } } | undefined
    )?.channel?.id;
    if (!channelId) {
      throw new Error(
        `Slack did not return an ID for channel "${channelName}"`,
      );
    }

    const memberIds: string[] = [];
    for (const [step, email] of [
      ["find-recruiter-in-slack", recruiterEmail],
      ["find-hiring-manager-in-slack", hiringManagerEmail],
    ] as const) {
      const found = await ctx.step(step, async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "search",
          actionKey: "user_by_email",
          connection: "slack",
          inputs: { email },
        }),
      );
      const id = (found.data[0] as { id?: string } | undefined)?.id;
      if (id) memberIds.push(id);
    }

    if (memberIds.length > 0) {
      await ctx.step("invite-hiring-team", async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "write",
          actionKey: "channels_invite_v2",
          connection: "slack",
          inputs: { channel: channelId, users: memberIds },
        }),
      );
    }

    await ctx.step("post-hiring-material-to-channel", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: channelId,
          text: `Welcome to the hiring channel for ${roleTitle}. The first draft of the hiring material is in ${doc.alternateLink}. Please review and customize it before it is shared.`,
          as_bot: "yes",
          link_names: "yes",
          unfurl: "no",
        },
      }),
    );

    await ctx.step("save-channel-and-doc-to-record", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "update_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          record_id: recordId,
          [`new__data__${CHANNEL_FIELD}`]: channelName,
          [`new__data__${DOCUMENT_LINK_FIELD}`]: doc.alternateLink,
        },
      }),
    );

    return {
      recordId,
      channel: channelName,
      documentId: doc.id,
      documentLink: doc.alternateLink,
      invited: memberIds.length,
    };
  },
);

export default workflow;
