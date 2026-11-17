import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TEAM_DIRECTORY_TABLE_ID,
  FEEDBACK_LOG_TABLE_ID,
  TEAM_EMAIL_FIELD,
  TEAM_NAME_FIELD,
  TEAM_SLACK_ID_FIELD,
  TEAM_MANAGER_EMAIL_FIELD,
  TEAM_CUSTOM_COACHING_FIELD,
  FEEDBACK_COLUMNS,
  GONG_API_BASE_URL,
  MIN_CALL_SECONDS,
  ESCALATION_SCORE,
  AI_MODEL_ID,
  AI_AUTHENTICATION_ID,
} from "./config.ts";
import {
  speakerIdForEmail,
  labelTranscript,
  formatStats,
  statValue,
  totalScore,
  tableCell,
  type Party,
  type Stat,
} from "./lib/call-coach.ts";

const sdk = createZapierSdk();

// The six criteria the transcript is scored on. Each gets a score (1-5) and written feedback.
const CRITERIA = [
  {
    key: "call_opening",
    label:
      "Opening the call effectively: did the rep open positively, set expectations and create a welcoming tone?",
  },
  {
    key: "questioning",
    label:
      "Questioning techniques: did the rep ask open-ended questions about the customer's needs, challenges and goals?",
  },
  {
    key: "rapport",
    label:
      "Building connection and rapport: did the rep build trust, a personal connection and empathy?",
  },
  {
    key: "value",
    label:
      "Demonstrating value: did the rep explain the value of the product or service and tie it to the customer's needs?",
  },
  {
    key: "commitment",
    label:
      "Asking for commitment: did the rep secure a commitment, a follow-up or clear next steps?",
  },
  {
    key: "flow",
    label:
      "Conversational flow: was the conversation natural, with smooth transitions and no awkward interruptions?",
  },
] as const;

// Gong's interaction statistics, with the success range the feedback is judged against.
const STAT_CRITERIA = [
  {
    name: "Talk Ratio",
    key: "talk_ratio",
    guidance:
      "Successful B2B sales calls usually have a rep talk-to-listen ratio between 0.37 and 0.49.",
  },
  {
    name: "Longest Monologue",
    key: "longest_monologue",
    guidance:
      "The rep should speak for no more than about 2.30 minutes at a time.",
  },
  {
    name: "Longest Customer Story",
    key: "longest_customer_story",
    guidance:
      "The customer should get room to describe their situation at length.",
  },
  {
    name: "Interactivity",
    key: "interactivity",
    guidance: "The call should have frequent back-and-forth exchanges.",
  },
  {
    name: "Patience",
    key: "patience",
    guidance:
      "The rep should leave pauses for the customer to answer rather than filling silence.",
  },
] as const;

const SCORING_INSTRUCTIONS = `# Role
You are a master call coach reviewing a sales or success call to help the rep improve.

# Instructions
Score the rep on each criterion below from 1 (poor) to 5 (excellent), and give feedback that cites specific moments from the transcript and a suggestion for improvement. Then give feedback on each interaction statistic against its guidance. Speakers labelled "Sales Rep" are the rep.`;

const SUMMARY_INSTRUCTIONS = `# Role
You are a master call coach helping a rep learn from a call.

# Instructions
Write a concise Slack message for the rep about this call. Use bold section headers, no more than three bullets per section, and actionable, professional language. Use these sections: ":+1: Strengths", ":warning: Areas for improvement", and ":hammer_and_wrench: Recommendations". If custom coaching feedback is provided, add a ":lightbulb: Custom coaching area" section.`;

const scoringOutputFields = [
  ...CRITERIA.flatMap((c) => [
    {
      name: `${c.key}_score`,
      type: "category_single",
      options: ["1", "2", "3", "4", "5"],
      isRequired: true,
    },
    { name: `${c.key}_feedback`, type: "text", isRequired: true },
  ]),
  ...STAT_CRITERIA.map((s) => ({
    name: `${s.key}_feedback`,
    type: "text",
    isRequired: true,
  })),
];

const TableRecord = z.record(z.string(), z.unknown());

const InputSchema = z
  .object({
    callData: z
      .object({
        metaData: z
          .object({
            id: z.string(),
            title: z.string().nullable().optional(),
            started: z.string().nullable().optional(),
            url: z.string().nullable().optional(),
            duration: z.union([z.number(), z.string()]).nullable().optional(),
          })
          .loose(),
        parties: z
          .array(
            z
              .object({
                emailAddress: z.string().nullable().optional(),
                speakerId: z.string().nullable().optional(),
              })
              .loose(),
          )
          .nullable()
          .optional(),
        interaction: z
          .object({
            interactionStats: z
              .array(
                z
                  .object({
                    name: z.string(),
                    value: z
                      .union([z.string(), z.number()])
                      .nullable()
                      .optional(),
                  })
                  .loose(),
              )
              .nullable()
              .optional(),
          })
          .loose()
          .nullable()
          .optional(),
      })
      .loose(),
  })
  .loose();

const workflow = defineDurable(
  "coach-reps-from-gong-calls-with-ai-in-slack",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const call = input.callData;
    const callId = call.metaData.id;

    if (!(Number(call.metaData.duration ?? 0) > MIN_CALL_SECONDS)) {
      return { skipped: true, reason: "short-call", callId };
    }

    const parties: Party[] = call.parties ?? [];
    const attendeeEmails = parties
      .map((party) => party.emailAddress ?? "")
      .filter((email) => email !== "");

    // Gong names attendees but not which one is the rep, so the team directory decides.
    const repLookup = await ctx.step("find-rep-in-team-directory", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "search",
        actionKey: "find_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TEAM_DIRECTORY_TABLE_ID,
          filter_count: "1",
          field_data_key: `data__${TEAM_EMAIL_FIELD}`,
          operator: "in",
          lookup_value: attendeeEmails,
        },
      }),
    );
    const rep = repLookup.data?.[0] as Record<string, unknown> | undefined;
    if (!rep) {
      return { skipped: true, reason: "rep-not-in-team-directory", callId };
    }

    const repEmail = tableCell(rep, TEAM_EMAIL_FIELD);
    const repSpeakerId = speakerIdForEmail(parties, repEmail);
    if (!repSpeakerId) {
      return { skipped: true, reason: "rep-not-on-call", callId };
    }

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
    const transcript = labelTranscript(
      rawTranscript,
      repSpeakerId,
      parties.map((party) => party.speakerId ?? "").filter((id) => id !== ""),
    );

    const stats: Stat[] = (call.interaction?.interactionStats ?? []).map(
      (s) => ({
        name: s.name,
        value: s.value,
      }),
    );

    const scoring = await ctx.step("score-call-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: AI_MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: `${SCORING_INSTRUCTIONS}\n\n# Criteria\n${CRITERIA.map((c) => `- ${c.label}`).join("\n")}\n\n# Interaction statistic guidance\n${STAT_CRITERIA.map((s) => `- ${s.name}: ${s.guidance}`).join("\n")}`,
          inputFields: {
            transcript,
            interaction_stats: formatStats(stats),
          },
          includeWorkflowData: false,
          outputFields: scoringOutputFields,
        },
      }),
    );
    const scored = (scoring.data[0] ?? {}) as Record<string, unknown>;
    const text = (name: string) => String(scored[name] ?? "").trim();
    const criterionScores = CRITERIA.map((c) =>
      Number(scored[`${c.key}_score`]),
    );
    const total = totalScore(criterionScores);

    const customArea = tableCell(rep, TEAM_CUSTOM_COACHING_FIELD).trim();
    const customFeedback = customArea
      ? String(
          (
            await ctx.step("coach-custom-area-with-ai", async () =>
              sdk.runAction({
                appKey: "ai",
                actionType: "write",
                actionKey: "get_completion",
                inputs: {
                  model_id: AI_MODEL_ID,
                  authentication_id: AI_AUTHENTICATION_ID,
                  instructions:
                    "# Role\nYou are a master call coach.\n\n# Instructions\nAssess the rep against the custom coaching area below using the transcript. Cite specific examples and suggest improvements.",
                  inputFields: { transcript, custom_coaching_area: customArea },
                  includeWorkflowData: false,
                  outputFields: [
                    {
                      name: "custom_coaching_feedback",
                      type: "text",
                      isRequired: true,
                    },
                  ],
                },
              }),
            )
          ).data[0]?.custom_coaching_feedback ?? "",
        ).trim()
      : "No custom coaching area selected.";

    const digest = [
      ...CRITERIA.map(
        (c) =>
          `${c.label}\nScore: ${text(`${c.key}_score`)} of 5\n${text(`${c.key}_feedback`)}`,
      ),
      ...STAT_CRITERIA.map(
        (s) =>
          `${s.name}: ${statValue(stats, s.name) ?? "unknown"}\n${text(`${s.key}_feedback`)}`,
      ),
      `Custom coaching area${customArea ? `: ${customArea}` : ""}\n${customFeedback}`,
    ].join("\n\n");

    const summary = await ctx.step("write-coaching-summary-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: AI_MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: SUMMARY_INSTRUCTIONS,
          inputFields: {
            call_title: call.metaData.title ?? "",
            feedback: digest,
            total_score: String(total),
          },
          includeWorkflowData: false,
          outputFields: [{ name: "summary", type: "text", isRequired: true }],
        },
      }),
    );
    const coachingSummary = String(
      (summary.data[0] as Record<string, unknown> | undefined)?.summary ?? "",
    ).trim();

    const cell = (
      name: keyof typeof FEEDBACK_COLUMNS,
      value: string | number,
    ) => [`new__data__${FEEDBACK_COLUMNS[name]}`, value] as const;

    const row = await ctx.step("log-feedback-row", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: FEEDBACK_LOG_TABLE_ID,
          ...Object.fromEntries([
            cell("title", call.metaData.title ?? ""),
            cell("call_date", call.metaData.started ?? ""),
            cell("call_url", call.metaData.url ?? ""),
            cell("rep_name", tableCell(rep, TEAM_NAME_FIELD)),
            cell("rep_email", repEmail),
            cell("feedback_summary", coachingSummary),
            cell("total_score", total),
            ...CRITERIA.flatMap((c, i) => [
              cell(
                `${c.key}_score` as keyof typeof FEEDBACK_COLUMNS,
                criterionScores[i],
              ),
              cell(
                `${c.key}_feedback` as keyof typeof FEEDBACK_COLUMNS,
                text(`${c.key}_feedback`),
              ),
            ]),
            ...STAT_CRITERIA.flatMap((s) => [
              cell(
                `${s.key}_stat` as keyof typeof FEEDBACK_COLUMNS,
                statValue(stats, s.name) ?? "",
              ),
              cell(
                `${s.key}_feedback` as keyof typeof FEEDBACK_COLUMNS,
                text(`${s.key}_feedback`),
              ),
            ]),
            cell("custom_coaching_feedback", customFeedback),
          ]),
        },
      }),
    );
    const logged = row.data[0] as Record<string, unknown> | undefined;
    const logLink = `https://tables.zapier.com/app/tables/t/${FEEDBACK_LOG_TABLE_ID}`;
    const message = `*Call coach for ${call.metaData.title ?? "your call"}*\n\n*Summary:*\n${coachingSummary}\n\n*Total call score:* ${total} of 30\n\n*:link: <${logLink}|Detailed feedback and call metrics>*`;

    await ctx.step("dm-rep-feedback", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "direct_message",
        connection: "slack",
        inputs: {
          channel: tableCell(rep, TEAM_SLACK_ID_FIELD),
          text: message,
          as_bot: "yes",
          unfurl: "no",
          link_names: "yes",
          send_multi: "no",
          add_edit_link: "no",
        },
      }),
    );

    let managerNotified = false;
    const managerEmail = tableCell(rep, TEAM_MANAGER_EMAIL_FIELD);
    if (total < ESCALATION_SCORE && managerEmail) {
      const managerLookup = await ctx.step("find-rep-manager", async () =>
        sdk.runAction({
          appKey: "zapier-tables",
          actionType: "search",
          actionKey: "find_record",
          connection: "zapier-tables",
          inputs: {
            table_id: TEAM_DIRECTORY_TABLE_ID,
            filter_count: "1",
            field_data_key: `data__${TEAM_EMAIL_FIELD}`,
            operator: "exact",
            lookup_value: managerEmail,
          },
        }),
      );
      const manager = managerLookup.data?.[0] as
        Record<string, unknown> | undefined;
      if (manager) {
        await ctx.step("dm-manager-escalation", async () =>
          sdk.runAction({
            appKey: "slack",
            actionType: "write",
            actionKey: "direct_message",
            connection: "slack",
            inputs: {
              channel: tableCell(manager, TEAM_SLACK_ID_FIELD),
              text: `Heads up: this call scored below ${ESCALATION_SCORE} and is likely worth reviewing.\n\n${message}`,
              as_bot: "yes",
              unfurl: "no",
              link_names: "yes",
              send_multi: "no",
              add_edit_link: "no",
            },
          }),
        );
        managerNotified = true;
      }
    }

    return {
      callId,
      rep: repEmail,
      total,
      logged: logged ?? null,
      managerNotified,
    };
  },
);

export default workflow;
