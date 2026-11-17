import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  FEEDBACK_PROPERTY,
  INSTRUCTIONS,
  MAX_FEEDBACK_CHARS,
  MAX_THEMES,
  MODEL,
  NOTION_DATA_SOURCE_ID,
  THEME_OPTIONS,
  THEME_PROPERTY,
} from "./config.ts";

const sdk = createZapierSdk();

// The new Notion data source item as the trigger delivers it. Only the id is read by name; the feedback text is read by its property key.
const ItemSchema = z.object({ id: z.string() }).loose();

const ThemesSchema = z.array(z.string());

// ChatGPT is asked for a JSON array. Tags outside THEME_OPTIONS are dropped so the property only receives known options.
function parseThemes(output: string): string[] {
  const match = output.match(/\[[\s\S]*\]/);
  if (!match) return [];
  let parsed: unknown;
  try {
    parsed = JSON.parse(match[0]);
  } catch {
    return [];
  }
  const list = ThemesSchema.safeParse(parsed);
  if (!list.success) return [];
  const known = list.data.filter((theme) => THEME_OPTIONS.includes(theme));
  return [...new Set(known)].slice(0, MAX_THEMES);
}

const workflow = defineDurable(
  "tag-customer-feedback-themes-in-notion-with-chatgpt",
  async (ctx, rawInput) => {
    const item = ItemSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const feedback = String(item[FEEDBACK_PROPERTY] ?? "")
      .trim()
      .slice(0, MAX_FEEDBACK_CHARS);
    if (!feedback) {
      return { skipped: true, reason: "no-feedback-text", id: item.id };
    }

    const reply = await ctx.step("tag-feedback-with-chatgpt", async () =>
      sdk.runAction({
        appKey: "chatgpt",
        actionType: "write",
        actionKey: "conversation_responses_api",
        connection: "chatgpt",
        inputs: {
          model: MODEL,
          instructions: INSTRUCTIONS,
          user_message: `Customer feedback:\n${feedback}`,
          response_format: "text",
        },
      }),
    );

    const output = String(
      (reply.data?.[0] as { output?: string } | undefined)?.output ?? "",
    );
    const themes = parseThemes(output);
    if (themes.length === 0) {
      return { skipped: true, reason: "no-matching-themes", id: item.id };
    }

    await ctx.step(`tag-notion-item-${item.id}`, async () =>
      sdk.runAction({
        appKey: "notion",
        actionType: "write",
        actionKey: "update_database_item",
        connection: "notion",
        inputs: {
          datasource: NOTION_DATA_SOURCE_ID,
          page: item.id,
          [THEME_PROPERTY]: themes,
        },
      }),
    );

    return { id: item.id, themes };
  },
);

export default workflow;
