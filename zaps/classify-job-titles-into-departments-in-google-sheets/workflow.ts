import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  TITLE_COLUMN,
  DEPARTMENT_COLUMN,
  CHATGPT_MODEL,
} from "./config.ts";

const sdk = createZapierSdk();

// The departments a title can be sorted into. The model is asked for exactly one of these.
const DEPARTMENTS = [
  "Executive",
  "Engineering",
  "Product",
  "Design",
  "Sales",
  "Marketing",
  "Customer Support",
  "Finance",
  "Human Resources",
  "Operations",
  "Legal",
  "IT",
  "Other",
];

const INSTRUCTIONS = `You sort job titles into departments. Reply with exactly one department from this list, spelled exactly as written, and nothing else: ${DEPARTMENTS.join(", ")}.`;

// Seconds to wait before each check of a response that has not come back yet.
const POLL_INTERVAL_SECONDS = 30;
// Checks before giving up; 10 checks at 30 seconds is five minutes.
const MAX_POLLS = 10;

// The new row as the trigger delivers it. Column keys are read from the sheet, so the title
// stays optional; a row without one is skipped.
const InputSchema = z
  .object({
    id: z.union([z.string(), z.number()]).nullable().optional(),
    row: z.union([z.string(), z.number()]).nullable().optional(),
    [TITLE_COLUMN]: z.string().nullable().optional(),
  })
  .loose();

type ResponseBody = {
  id?: string;
  output?: Array<{
    type?: string;
    content?: Array<{ type?: string; text?: string }>;
  }>;
};

function outputText(body: ResponseBody | undefined): string {
  return (body?.output ?? [])
    .filter((item) => item.type === "message")
    .flatMap((item) => item.content ?? [])
    .filter(
      (part) => part.type === "output_text" && typeof part.text === "string",
    )
    .map((part) => part.text)
    .join("")
    .trim();
}

const workflow = defineDurable(
  "classify-job-titles-into-departments-in-google-sheets",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const rowId = String(input.row ?? input.id);
    const title = (input[TITLE_COLUMN] ?? "").trim();

    if (!title) {
      return { skipped: true, reason: "no-title", row: rowId };
    }

    const submitted = await ctx.step("submit-department-request", async () =>
      sdk.runAction({
        appKey: "chatgpt",
        actionType: "write",
        actionKey: "conversation_responses_api",
        connection: "chatgpt",
        inputs: {
          model: CHATGPT_MODEL,
          instructions: INSTRUCTIONS,
          user_message: `Job title: ${title}`,
        },
      }),
    );

    const first = submitted.data[0] as ResponseBody | undefined;
    let answer = outputText(first);
    const responseId = first?.id;

    for (
      let attempt = 1;
      !answer && responseId && attempt <= MAX_POLLS;
      attempt++
    ) {
      await ctx.wait(`wait-before-poll-${attempt}`, POLL_INTERVAL_SECONDS);

      const fetched = await ctx.step(
        `get-department-response-${attempt}`,
        async () =>
          sdk.runAction({
            appKey: "chatgpt",
            actionType: "write",
            actionKey: "_zap_raw_request",
            connection: "chatgpt",
            inputs: {
              url: `https://api.openai.com/v1/responses/${responseId}`,
              fail_on_errors: "true",
            },
          }),
      );

      answer = outputText(fetched.data[0] as ResponseBody | undefined);
    }

    if (!answer) {
      return { ok: false, error: "no-classification", row: rowId, responseId };
    }

    const department =
      DEPARTMENTS.find((name) => name.toLowerCase() === answer.toLowerCase()) ??
      "Other";

    const updated = await ctx.step(`update-department-row-${rowId}`, async () =>
      sdk.runAction({
        appKey: "google-sheets",
        actionType: "write",
        actionKey: "update_row",
        connection: "google-sheets",
        inputs: {
          spreadsheet: SPREADSHEET_ID,
          worksheet: WORKSHEET_ID,
          row: rowId,
          [DEPARTMENT_COLUMN]: department,
        },
      }),
    );

    return {
      ok: true,
      row: rowId,
      title,
      department,
      reply: answer,
      sheet: updated.data[0] ?? null,
    };
  },
);

export default workflow;
