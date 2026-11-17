import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  ASANA_WORKSPACE_ID,
  ASANA_PROJECT_ID,
  USER_NAME_AND_ROLE,
  AI_MODEL,
} from "./config.ts";

const sdk = createZapierSdk();

// The Granola note as the new-note trigger delivers it. Every field past id is optional because
// a note may have no enhanced notes or transcript yet; the zap works from whichever are present.
const InputSchema = z
  .object({
    id: z.string(),
    calendar_event_title: z.string().nullable().optional(),
    calendar_event_time: z.string().nullable().optional(),
    my_notes: z.string().nullable().optional(),
    enhanced_notes: z.string().nullable().optional(),
    transcript: z.string().nullable().optional(),
  })
  .loose();

const PRIORITIES = ["P1", "P2", "P3", "P4"];

// The AI step's output rows. Every field is required, so a row missing one fails here, not in Asana.
const TaskSchema = z.object({
  Title: z.string(),
  "Due Date": z.string(),
  Priority: z.enum(["P1", "P2", "P3", "P4"]),
  evidence: z.string(),
});

const extractInstructions = (today: string) =>
  [
    `You are the executive assistant for ${USER_NAME_AND_ROLE}.`,
    "Read the meeting notes and transcript and extract every action item that person needs to handle.",
    "Include tasks even when they are not flagged as theirs, when the meeting makes them their responsibility.",
    "Keep each title short and specific. Give each evidence as a brief excerpt that prompted the task.",
    "Set the due date to the deadline the meeting names, or estimate one within a week of today, always a weekday.",
    `Today's date: ${today}`,
  ].join("\n");

const workflow = defineDurable(
  "create-asana-tasks-from-granola-action-items",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const my = input.my_notes ?? "";
    const enhanced = input.enhanced_notes ?? "";
    const transcript = input.transcript ?? "";
    if (!`${my}${enhanced}${transcript}`.trim()) {
      return { skipped: true, reason: "empty-note", id: input.id };
    }

    const today = new Date().toISOString().slice(0, 10);

    const tasks = await ctx.step(
      `extract-action-items-${input.id}`,
      async () => {
        const result = await sdk.runAction({
          appKey: "ai",
          actionType: "write",
          actionKey: "get_completion",
          connection: "ai",
          inputs: {
            model_id: AI_MODEL,
            authentication_id: "0",
            includeWorkflowData: false,
            instructions: extractInstructions(today),
            inputFields: {
              "My notes": my,
              "Enhanced notes": enhanced,
              Transcript: transcript,
            },
            outputFields: [
              { name: "Title", type: "text", isRequired: true },
              { name: "Due Date", type: "datetime", isRequired: true },
              {
                name: "Priority",
                type: "category_single",
                options: PRIORITIES,
                isRequired: true,
              },
              { name: "evidence", type: "text", isRequired: true },
            ],
            isOutputArray: true,
          },
        });
        return z.array(TaskSchema).parse(result.data);
      },
    );

    if (tasks.length === 0) {
      return { skipped: true, reason: "no-action-items", id: input.id };
    }

    const meetingTitle = input.calendar_event_title ?? "Granola meeting";
    const meetingTime = input.calendar_event_time ?? "";

    const created = [];
    for (const task of tasks) {
      const taskKey = task.Title.toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "")
        .slice(0, 60);

      const asanaTask = await ctx.step(
        `create-asana-task-${input.id}-${taskKey}`,
        async () =>
          sdk.runAction({
            appKey: "asana",
            actionType: "write",
            actionKey: "create_task_v2",
            connection: "asana",
            inputs: {
              workspace: ASANA_WORKSPACE_ID,
              task_name: task.Title,
              projects: [ASANA_PROJECT_ID],
              dueDate: task["Due Date"].slice(0, 10),
              dueType: "on",
              description: [
                `Priority: ${task.Priority}`,
                `Details: ${task.evidence}`,
                `Source: ${meetingTitle}${meetingTime ? ` (${meetingTime})` : ""}`,
              ].join("\n"),
              use_rich_text: "false",
            },
          }),
      );
      created.push(asanaTask.data[0] ?? null);
    }

    return { id: input.id, tasksCreated: created.length, tasks: created };
  },
);

export default workflow;
