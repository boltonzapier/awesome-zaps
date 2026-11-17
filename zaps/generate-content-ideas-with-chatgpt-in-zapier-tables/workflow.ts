import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  TITLE_FIELD,
  DETAILS_FIELD,
  TYPE_FIELD,
  AI_GENERATED_FIELD,
  STATUS_FIELD,
  DRAFT_STATUS,
  DEFAULT_MODEL,
  POLL_INTERVAL_SECONDS,
  MAX_POLLS,
  SYSTEM_INSTRUCTIONS,
} from "./config.ts";

const sdk = createZapierSdk();

const OptionalText = z.string().nullable().optional();

// The new Zapier Tables record as the trigger delivers it.
const InputSchema = z
  .object({
    record_id: OptionalText,
    new: z
      .object({
        data: z
          .object({
            f1: OptionalText,
            f2: OptionalText,
            f3: z.union([z.string(), z.number()]).nullable().optional(),
            f3__label: OptionalText,
            f4: z.boolean().nullable().optional(),
            f5: OptionalText,
          })
          .loose(),
      })
      .loose(),
  })
  .loose();

const IdeasSchema = z.object({
  ideas: z
    .array(
      z.object({
        title: z.string().min(1),
        details: z.string().min(1),
      }),
    )
    .min(1),
});

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

// The model is asked for JSON but can still add a code fence or prose around it, so a reply
// that does not parse is returned as null rather than saved.
function parseIdeas(text: string) {
  const body = text.replace(/^```(?:json)?\s*|\s*```$/g, "").trim();
  try {
    return IdeasSchema.parse(JSON.parse(body)).ideas;
  } catch {
    return null;
  }
}

// A short kebab-case key from an idea's title, for naming its save step.
const slugify = (title: string) =>
  title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "idea";

const workflow = defineDurable(
  "generate-content-ideas-with-chatgpt-in-zapier-tables",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );
    const row = input.new.data;

    // Ideas this zap saved are marked AI-generated; without this check they would generate more ideas.
    if (row.f4 === true) {
      return {
        skipped: true,
        reason: "ai-generated",
        recordId: input.record_id ?? null,
      };
    }

    const title = (row.f1 ?? "").trim();
    if (!title) {
      return {
        skipped: true,
        reason: "no-title",
        recordId: input.record_id ?? null,
      };
    }

    const contentType = row.f3__label ?? String(row.f3 ?? "");
    const userMessage = `Idea Title: ${title}\nIdea Details: ${(row.f2 ?? "").trim()}\nType of content: ${contentType} content`;

    const submitted = await ctx.step("submit-chatgpt-request", async () =>
      sdk.runAction({
        appKey: "chatgpt",
        actionType: "write",
        actionKey: "conversation_responses_api",
        connection: "chatgpt",
        inputs: {
          model: DEFAULT_MODEL,
          instructions: SYSTEM_INSTRUCTIONS,
          user_message: userMessage,
        },
      }),
    );

    const responseId = (submitted.data[0] as ResponseBody | undefined)?.id;
    if (!responseId) {
      return { ok: false, error: "no-response-id" };
    }

    let text = "";
    for (let attempt = 1; attempt <= MAX_POLLS && !text; attempt++) {
      await ctx.wait(`wait-before-poll-${attempt}`, POLL_INTERVAL_SECONDS);

      const fetched = await ctx.step(
        `get-chatgpt-response-${attempt}`,
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
      text = outputText(fetched.data[0] as ResponseBody | undefined);
    }
    if (!text) {
      return { ok: false, error: "no-content-after-polling", responseId };
    }

    const ideas = parseIdeas(text);
    if (!ideas) {
      return { ok: false, error: "unparseable-ideas", responseId };
    }

    // The new records have no IDs yet, so each step is named with a slug of the idea's title,
    // numbered when two titles in this run slugify the same.
    const slugCounts = new Map<string, number>();
    const saved: unknown[] = [];
    for (const idea of ideas) {
      const slug = slugify(idea.title);
      const seen = (slugCounts.get(slug) ?? 0) + 1;
      slugCounts.set(slug, seen);
      const key = seen === 1 ? slug : `${slug}-${seen}`;
      const created = await ctx.step(`save-idea-to-table-${key}`, async () =>
        sdk.runAction({
          appKey: "zapier-tables",
          actionType: "write",
          actionKey: "create_record",
          connection: "zapier-tables",
          inputs: {
            table_id: TABLE_ID,
            [`new__data__${TITLE_FIELD}`]: idea.title,
            [`new__data__${DETAILS_FIELD}`]: idea.details,
            [`new__data__${TYPE_FIELD}`]: contentType,
            [`new__data__${AI_GENERATED_FIELD}`]: true,
            [`new__data__${STATUS_FIELD}`]: DRAFT_STATUS,
          },
        }),
      );
      saved.push(created.data[0] ?? null);
    }

    return {
      ok: true,
      recordId: input.record_id ?? null,
      created: saved.length,
      records: saved,
    };
  },
);

export default workflow;
