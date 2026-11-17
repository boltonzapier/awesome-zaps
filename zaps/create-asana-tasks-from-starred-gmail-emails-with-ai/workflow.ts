import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  ASANA_WORKSPACE_ID,
  ASANA_PROJECT_ID,
  ASANA_ASSIGNEE_ID,
  SLACK_CHANNEL,
  AI_MODEL,
  NO_REPLY_MARKER,
} from "./config.ts";

const sdk = createZapierSdk();

// The starred email as the Gmail trigger delivers it.
const InputSchema = z
  .object({
    message_id: z.string(),
    subject: z.string().nullable().optional(),
    body_plain: z.string().nullable().optional(),
    message_url: z.string().nullable().optional(),
    from: z
      .object({
        email: z.string().nullable().optional(),
      })
      .loose()
      .nullable()
      .optional(),
    from__email: z.string().nullable().optional(),
    all_attachments: z.array(z.unknown()).nullable().optional(),
  })
  .loose();

// One task as the AI step returns it, with the due date as YYYY-MM-DD.
type ExtractedTask = {
  "Task Name"?: string;
  "Task Description"?: string;
  "Due Date"?: string;
};

// The prompt is written for the zap's purpose: only the tasks the zap owner must do, not tasks for other people.
const EXTRACTION_PROMPT = `You are a task extraction assistant. Review the email and list ONLY the actionable items the Zap owner is responsible for completing. Ignore tasks assigned to other people.

For each task, return:
- Task Name: a short summary of the action, about eight words at most.
- Task Description: what the owner needs to do, with any relevant context from the email.
- Due Date: the date in YYYY-MM-DD form. Use a date the email states, or work out a relative one ("by Friday") from today's date. If the email gives no date, use today plus three days.

Return an array of objects with the keys "Task Name", "Task Description" and "Due Date". If there is no task for the owner, return an empty array.`;

const slugify = (text: string): string =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);

const workflow = defineDurable(
  "create-asana-tasks-from-starred-gmail-emails-with-ai",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const senderEmail = input.from?.email ?? input.from__email ?? "";

    if (!input.subject) {
      return {
        skipped: true,
        reason: "no-subject",
        messageId: input.message_id,
      };
    }
    if (senderEmail.toLowerCase().includes(NO_REPLY_MARKER)) {
      return {
        skipped: true,
        reason: "no-reply-sender",
        messageId: input.message_id,
      };
    }

    const today = await ctx.step("capture-today", async () =>
      new Date().toISOString().slice(0, 10),
    );

    const extraction = await ctx.step(
      `extract-tasks-${input.message_id}`,
      async () =>
        sdk.runAction({
          appKey: "ai",
          actionType: "write",
          actionKey: "get_completion",
          connection: "ai",
          inputs: {
            model_id: AI_MODEL,
            provider_id: "openai",
            authentication_id: "0",
            instructions: EXTRACTION_PROMPT,
            inputFields: { email: input.body_plain ?? "", today },
            isOutputArray: "true",
            outputSchema: {
              "Task Name":
                "A short summary of the action item, about eight words at most.",
              "Task Description":
                "What the owner needs to do, with relevant context from the email.",
              "Due Date": "The due date in YYYY-MM-DD form.",
            },
          },
        }),
    );

    const tasks =
      (extraction.data[0] as { result?: ExtractedTask[] } | undefined)
        ?.result ?? [];
    if (tasks.length === 0) {
      return { skipped: true, reason: "no-tasks", messageId: input.message_id };
    }

    const created: Array<{ name: string; gid: string; url: string }> = [];

    for (const task of tasks) {
      const name = task["Task Name"] ?? "Follow up on email";
      const key = `${input.message_id}-${slugify(name)}`;

      const asanaTask = await ctx.step(`create-asana-task-${key}`, async () =>
        sdk.runAction({
          appKey: "asana",
          actionType: "write",
          actionKey: "create_task_v2",
          connection: "asana",
          inputs: {
            task_name: name,
            description: `Description: ${task["Task Description"] ?? ""}\n\nEmail Body: ${input.body_plain ?? ""}\nEmail Message Link: ${input.message_url ?? ""}`,
            dueDate: task["Due Date"] ?? "",
            dueType: "on",
            workspace: ASANA_WORKSPACE_ID,
            projects: [ASANA_PROJECT_ID],
            assignee: ASANA_ASSIGNEE_ID,
            use_rich_text: "false",
          },
        }),
      );

      const record = asanaTask.data[0] as
        { gid: string; permalink_url: string } | undefined;
      if (!record) {
        continue;
      }

      if (input.all_attachments && input.all_attachments.length > 0) {
        await ctx.step(`attach-files-to-asana-task-${key}`, async () =>
          sdk.runAction({
            appKey: "asana",
            actionType: "write",
            actionKey: "attach_file",
            connection: "asana",
            inputs: {
              file: input.all_attachments,
              task: record.gid,
              project: ASANA_PROJECT_ID,
            },
          }),
        );
      }

      await ctx.step(`notify-slack-about-task-${key}`, async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "write",
          actionKey: "direct_message",
          connection: "slack",
          inputs: {
            channel: SLACK_CHANNEL,
            text: `A new task has been created for you to complete based on a starred email\n<${record.permalink_url}|${name}>`,
            as_bot: "yes",
            unfurl: "yes",
            link_names: "yes",
          },
        }),
      );

      created.push({ name, gid: record.gid, url: record.permalink_url });
    }

    return { messageId: input.message_id, tasks: created };
  },
);

export default workflow;
