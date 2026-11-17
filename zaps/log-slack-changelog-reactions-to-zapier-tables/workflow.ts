import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TEAM_DIRECTORY_TABLE_ID,
  CHANGELOG_TABLE_ID,
  CHANGELOG_URL,
  TEAM_NAME_FIELD,
  TEAM_SLACK_ID_FIELD,
  CHANGELOG_TITLE_FIELD,
  CHANGELOG_SUMMARY_FIELD,
  CHANGELOG_MESSAGE_TS_FIELD,
  CHANGELOG_MESSAGE_TEXT_FIELD,
  CHANGELOG_SLACK_LINK_FIELD,
  CHANGELOG_RECORDED_BY_FIELD,
  CHANGELOG_MESSAGE_FROM_FIELD,
  AI_MODEL_ID,
  AI_AUTHENTICATION_ID,
} from "./config.ts";

const sdk = createZapierSdk();

const CHANGELOG_PROMPT =
  "You are a master of technical writing and changelog creation. Given the changelog text in the changelog_text input field, create a concise and informative title and summary for a changelog entry.\n\nThe title must be exactly 50 characters long, including spaces and punctuation. Use active voice and present tense. Focus on the most important aspect of the change. Omit articles (a, an, the) when clarity allows.\n\nThe summary must be 200 to 250 characters. It gives more detail than the title and stays concise.\n\nReturn no labels or extra formatting. Return a blank string for a field you cannot generate.";

// The reacted message as the Slack reaction trigger delivers it, with message detail set to content and the author and permalink enrichments.
const InputSchema = z
  .object({
    user: z.string().nullable().optional(),
    message: z
      .object({
        ts: z.string(),
        raw_text: z.string().nullable().optional(),
        permalink: z.string().nullable().optional(),
        channel: z.object({ id: z.string() }).loose().nullable().optional(),
        user: z
          .object({
            name: z.string().nullable().optional(),
            real_name: z.string().nullable().optional(),
          })
          .loose()
          .nullable()
          .optional(),
      })
      .loose(),
  })
  .loose();

// Reads one column of a Zapier Tables record, whether it arrives nested (old.data.f2) or flat (old__data__f2).
const tableField = (record: Record<string, unknown>, key: string): string => {
  const nested = (record.old as { data?: Record<string, unknown> } | undefined)
    ?.data?.[key];
  const flat = record[`old__data__${key}`];
  return String(nested ?? flat ?? "").trim();
};

const workflow = defineDurable(
  "log-slack-changelog-reactions-to-zapier-tables",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const { message } = input;
    const text = (message.raw_text ?? "").trim();
    if (!text) {
      return { skipped: true, reason: "no-text", ts: message.ts };
    }

    // Only changelog reactions from the team directory are logged.
    const member = await ctx.step("find-team-member", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "search",
        actionKey: "find_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TEAM_DIRECTORY_TABLE_ID,
          filter_count: "1",
          field_data_key: TEAM_SLACK_ID_FIELD,
          operator: "exact",
          lookup_value: input.user ?? "",
        },
      }),
    );
    const memberRecord = member.data[0] as Record<string, unknown> | undefined;
    if (!memberRecord) {
      return { skipped: true, reason: "not-team-member", ts: message.ts };
    }
    const recordedBy = tableField(memberRecord, TEAM_NAME_FIELD);

    // A message already in the changelog is not logged again.
    const existing = await ctx.step("find-changelog-entry", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "search",
        actionKey: "find_record",
        connection: "zapier-tables",
        inputs: {
          table_id: CHANGELOG_TABLE_ID,
          filter_count: "1",
          field_data_key: CHANGELOG_MESSAGE_TS_FIELD,
          operator: "exact",
          lookup_value: message.ts,
        },
      }),
    );

    const threadInputs = {
      channel: message.channel?.id ?? "",
      thread_ts: message.ts,
      as_bot: "yes",
      username: "Changelog bot",
      link_names: "yes",
      add_edit_link: "yes",
      reply_broadcast: "no",
    };

    if (existing.data[0]) {
      await ctx.step("reply-already-logged", async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "write",
          actionKey: "channel_message",
          connection: "slack",
          inputs: {
            ...threadInputs,
            text: `This has already been logged. To avoid creating duplicates, I didn't create another one.\n\n> Want to record it again? Copy your note into a new message and use :changelog:.\n\n<${CHANGELOG_URL}|View the changelog>`,
          },
        }),
      );
      return { skipped: true, reason: "already-logged", ts: message.ts };
    }

    const drafted = await ctx.step("write-title-and-summary", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        connection: "ai",
        inputs: {
          model_id: AI_MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: CHANGELOG_PROMPT,
          inputFields: { changelog_text: text },
          includeWorkflowData: false,
          outputFields: [
            { name: "title", type: "text", isRequired: true },
            { name: "summary", type: "text", isRequired: true },
          ],
          isOutputArray: false,
        },
      }),
    );
    const draft = drafted.data[0] as
      { title?: string | null; summary?: string | null } | undefined;

    const entry = await ctx.step("create-changelog-entry", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: CHANGELOG_TABLE_ID,
          [`new__data__${CHANGELOG_TITLE_FIELD}`]: draft?.title ?? "",
          [`new__data__${CHANGELOG_SUMMARY_FIELD}`]: draft?.summary ?? "",
          [`new__data__${CHANGELOG_MESSAGE_TS_FIELD}`]: message.ts,
          [`new__data__${CHANGELOG_MESSAGE_TEXT_FIELD}`]: text,
          [`new__data__${CHANGELOG_SLACK_LINK_FIELD}`]: message.permalink ?? "",
          [`new__data__${CHANGELOG_RECORDED_BY_FIELD}`]: recordedBy,
          [`new__data__${CHANGELOG_MESSAGE_FROM_FIELD}`]:
            message.user?.real_name ?? message.user?.name ?? "",
        },
      }),
    );

    await ctx.step("reply-added-to-changelog", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          ...threadInputs,
          text: `Thanks! This has been added to the changelog :tada:\n\n<${CHANGELOG_URL}|View the changelog>`,
        },
      }),
    );

    return {
      ts: message.ts,
      title: draft?.title ?? null,
      entry: entry.data[0] ?? null,
    };
  },
);

export default workflow;
