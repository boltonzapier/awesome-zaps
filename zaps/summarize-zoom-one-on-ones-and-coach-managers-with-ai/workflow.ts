import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  ZOOM_HOST_NAME,
  ONE_ON_ONE_TITLE_TEXT,
  FEEDBACK_TABLE_ID,
  FEEDBACK_COLUMNS,
  SLACK_USER_ID,
  TRANSCRIPT_WAIT_SECONDS,
  AI_MODEL_ID,
  AI_AUTHENTICATION_ID,
} from "./config.ts";
import {
  parseVttSegments,
  transcriptForPrompt,
  talkListenRatio,
  findTranscriptUrl,
  formatMeetingDate,
  isOneOnOne,
} from "./lib/meeting-coach.ts";

const sdk = createZapierSdk();

const COACHING_INSTRUCTIONS = `# Objective
Analyze the transcript of a manager and direct report 1:1 meeting and give constructive feedback to improve the manager's skills. Focus on four areas:

1. Coaching by asking open-ended questions: how well the manager invites the direct report to reflect and share, rather than always giving instructions.
2. Setting expectations: how clearly the manager states expectations for tasks, behavior and outcomes.
3. Giving feedback: how constructive, specific and balanced the feedback is, with both strengths and areas for improvement.
4. Reflecting on results: how the manager discusses past achievements and areas that need work.

# Input
The meeting host is the manager. The talk/listen ratio is the share of the meeting the host spent talking. Use it as one signal alongside the transcript.

# Output
- strengths: 2-3 strengths the manager showed, each with a specific example from the transcript.
- areas_for_improvement: 2-3 areas to work on, each with an actionable suggestion.
- overall_assessment: a brief overall assessment and one key recommendation for the next 1:1.`;

const SUMMARY_INSTRUCTIONS = `You are a master of professional communication analysis reviewing a 1:1 meeting transcript between a manager and their direct report. Analyze the transcript carefully and summarize it.

- discussion_notes: a bullet-point list of the main topics discussed. Blank if none can be extracted.
- action_items: a bullet-point list of tasks, assignments and follow-ups agreed on or mentioned. Blank if none.
- feedback: specific feedback given by either person, including who gave it and to whom. Blank if none.

Be thorough and objective. If a section does not apply, leave it blank.`;

const TREND_INSTRUCTIONS = `You are coaching a manager on their 1:1 conversations. Below is their feedback history from the past two months, most recent first (feedbackHistory), followed by today's feedback (todayFeedback).

Place today's feedback within the larger arc of their progress. Cover:
1. Positive trends: skills they have improved over time.
2. Consistent strengths: abilities they reliably show.
3. Emerging patterns: recurring challenges that need continued focus.

If the feedback history is blank, output a blank analysis. Otherwise write a short statement in the second person, for example: "Over the past several weeks, you've made noticeable progress in ..."`;

const InputSchema = z
  .object({
    uuid: z.string(),
    topic: z.string().nullable().optional(),
    start_time: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "summarize-zoom-one-on-ones-and-coach-managers-with-ai",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const topic = input.topic ?? "Untitled meeting";

    if (!isOneOnOne(topic, ONE_ON_ONE_TITLE_TEXT)) {
      return { skipped: true, reason: "not-a-one-on-one", uuid: input.uuid };
    }

    // Zoom writes the audio transcript some time after the recording completes.
    await ctx.wait("wait-for-transcript", TRANSCRIPT_WAIT_SECONDS);

    const recordings = await ctx.step("get-meeting-recording-files", async () =>
      sdk.runAction({
        appKey: "zoom",
        actionType: "write",
        actionKey: "_zap_raw_request",
        connection: "zoom",
        inputs: {
          url: `https://api.zoom.us/v2/meetings/${input.uuid}/recordings`,
          method: "GET",
          headers: { "Content-Type": "application/json" },
          querystring: { include_transcript: "true" },
          fail_on_errors: true,
        },
      }),
    );
    const body = String(recordings.data[0]?.content ?? "");

    const transcriptUrl = findTranscriptUrl(body);
    if (!transcriptUrl) {
      return { skipped: true, reason: "no-audio-transcript", uuid: input.uuid };
    }

    const vtt = await ctx.step("download-audio-transcript", async () => {
      const response = await sdk.fetch(transcriptUrl, {
        connection: "zoom",
        method: "GET",
      });
      if (!response.ok) {
        throw new Error(`Zoom returned ${response.status} for the transcript`);
      }
      return response.text();
    });

    const segments = parseVttSegments(vtt);
    const ratio = talkListenRatio(segments, ZOOM_HOST_NAME);
    const transcript = transcriptForPrompt(segments);
    const date = formatMeetingDate(input.start_time ?? "");

    const coaching = await ctx.step("coach-manager-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: AI_MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: COACHING_INSTRUCTIONS,
          inputFields: {
            host: ZOOM_HOST_NAME,
            talk_listen_ratio: `${ratio.hostSeconds} of ${ratio.totalSeconds} seconds (${ratio.percent})`,
            transcript,
          },
          includeWorkflowData: false,
          outputFields: [
            { name: "strengths", type: "text", isRequired: true },
            { name: "areas_for_improvement", type: "text", isRequired: true },
            { name: "overall_assessment", type: "text", isRequired: true },
          ],
        },
      }),
    );
    const feedback = (coaching.data[0] ?? {}) as Record<string, string>;

    const summary = await ctx.step("summarize-meeting-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: AI_MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: SUMMARY_INSTRUCTIONS,
          inputFields: { transcript },
          includeWorkflowData: false,
          outputFields: [
            { name: "discussion_notes", type: "text", isRequired: true },
            { name: "action_items", type: "text", isRequired: true },
            { name: "feedback", type: "text", isRequired: true },
          ],
        },
      }),
    );
    const notes = (summary.data[0] ?? {}) as Record<string, string>;

    const history = await ctx.step(
      "find-feedback-from-past-two-months",
      async () =>
        sdk.runAction({
          appKey: "zapier-tables",
          actionType: "search",
          actionKey: "find_records",
          connection: "zapier-tables",
          inputs: {
            table_id: FEEDBACK_TABLE_ID,
            filter_count: "2",
            operator: "lt",
            field_data_key: `data__${FEEDBACK_COLUMNS.date}`,
            lookup_value: "today",
            operator_2: "gt",
            field_data_key_2: `data__${FEEDBACK_COLUMNS.date}`,
            lookup_value_2: "-2 months",
            _zap_search_success_on_miss: true,
          },
        }),
    );

    const trend = await ctx.step("analyze-feedback-trend-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: AI_MODEL_ID,
          authentication_id: AI_AUTHENTICATION_ID,
          instructions: TREND_INSTRUCTIONS,
          inputFields: {
            feedbackHistory: JSON.stringify(history.data),
            todayFeedback: [
              `Overall assessment: ${feedback.overall_assessment ?? ""}`,
              `Strengths: ${feedback.strengths ?? ""}`,
              `Areas for improvement: ${feedback.areas_for_improvement ?? ""}`,
            ].join("\n"),
          },
          includeWorkflowData: false,
          outputFields: [{ name: "analysis", type: "text", isRequired: true }],
        },
      }),
    );
    const trendText = String(
      (trend.data[0] as Record<string, unknown> | undefined)?.analysis ?? "",
    ).trim();

    const row = await ctx.step("log-feedback-row", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: FEEDBACK_TABLE_ID,
          [`new__data__${FEEDBACK_COLUMNS.title}`]: topic,
          [`new__data__${FEEDBACK_COLUMNS.date}`]: date,
          [`new__data__${FEEDBACK_COLUMNS.feedback}`]: [
            `Overall assessment: ${feedback.overall_assessment ?? ""}`,
            `Strengths: ${feedback.strengths ?? ""}`,
            `Areas for improvement: ${feedback.areas_for_improvement ?? ""}`,
            `Feedback trend: ${trendText}`,
          ].join("\n\n"),
          [`new__data__${FEEDBACK_COLUMNS.recap}`]: [
            `Discussion points:\n${notes.discussion_notes ?? ""}`,
            `Feedback given:\n${notes.feedback ?? ""}`,
            `Action items:\n${notes.action_items ?? ""}`,
          ].join("\n\n"),
        },
      }),
    );

    const message = [
      `*You've got new feedback to help you grow as a manager!*`,
      `*Feedback from ${topic}*`,
      `:mag: *Overall assessment*\n${feedback.overall_assessment ?? ""}`,
      `:muscle: *Strengths*\n${feedback.strengths ?? ""}`,
      `:bar_chart: *Areas for improvement*\n${feedback.areas_for_improvement ?? ""}`,
      `:chart_with_upwards_trend: *Talk/listen ratio*\n${ratio.percent} of the meeting`,
      `:rocket: *Feedback trend*\n${trendText}`,
    ].join("\n\n");

    await ctx.step("dm-manager-feedback", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "direct_message",
        connection: "slack",
        inputs: {
          channel: SLACK_USER_ID,
          text: message,
          as_bot: "yes",
          unfurl: "no",
          link_names: "yes",
          send_multi: "no",
          add_edit_link: "no",
        },
      }),
    );

    return {
      uuid: input.uuid,
      topic,
      talkListenRatio: ratio.percent,
      logged: row.data[0] ?? null,
    };
  },
);

export default workflow;
