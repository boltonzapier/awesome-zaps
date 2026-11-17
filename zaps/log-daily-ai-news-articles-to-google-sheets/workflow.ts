import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  DATE_COLUMN,
  TITLE_COLUMN,
  LINK_COLUMN,
  HEADLINE_COLUMN,
  SUMMARY_COLUMN,
  MODEL_ID,
} from "./config.ts";
import { articleId } from "./lib/article-id.ts";

const sdk = createZapierSdk();

// The daily schedule trigger sends nothing the zap reads; the schema only checks that the input parses.
const InputSchema = z.object({}).loose();

// One article as the AI step returns it. Every field is required so no row is written half empty.
const ArticleSchema = z.object({
  date: z.string(),
  title: z.string(),
  link: z.string(),
  headline: z.string(),
  summary: z.string(),
});

const SearchResultSchema = z.object({
  result: z.object({ items: z.array(ArticleSchema) }),
});

function buildPrompt(today: string): string {
  return `Your goal is to identify and compile a list of AI-related brands and companies that are being covered in the news online. Today is ${today}. Search for AI-related news or new product launches published yesterday, and only those.

Search scope: focus on AI-focused or reputable sources. Look for trending news or new products that have just launched, specifically about AI-related products or brands.

Data extraction: for each article or review found, extract:
- date: the publication date in DAY/MONTH/YEAR format
- title: the title of the article or review
- link: the link to the article or review

Writing: for each article, write a captivating clickbait headline (headline) and a summary (summary). The summary should let the reader skim the article and know the latest news.

Quality assurance: double-check that every article has a date, title, link, headline and summary before returning it. Return only articles you have read.`;
}

const workflow = defineDurable(
  "log-daily-ai-news-articles-to-google-sheets",
  async (ctx, rawInput) => {
    InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const today = await ctx.step("capture-date", async () =>
      new Date().toISOString().slice(0, 10),
    );

    const search = await ctx.step("find-ai-news", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        inputs: {
          model_id: MODEL_ID,
          authentication_id: "0",
          instructions: buildPrompt(today),
          includeWorkflowData: false,
          isOutputArray: true,
          outputFields: [
            { name: "date", type: "text", isRequired: true },
            { name: "title", type: "text", isRequired: true },
            { name: "link", type: "text", isRequired: true },
            { name: "headline", type: "text", isRequired: true },
            { name: "summary", type: "text", isRequired: true },
          ],
          tools: [
            {
              type: "builtin",
              id: "tool_web_search",
              builtin_tool_name: "web_search",
            },
            {
              type: "builtin",
              id: "tool_web_scrape",
              builtin_tool_name: "web_scrape",
            },
            { type: "builtin", id: "tool_fail", builtin_tool_name: "fail" },
          ],
        },
      }),
    );

    const { result } = SearchResultSchema.parse(search.data[0]);
    if (result.items.length === 0) {
      return { date: today, logged: 0 };
    }

    for (const article of result.items) {
      await ctx.step(`log-article-${articleId(article.link)}`, async () =>
        sdk.runAction({
          appKey: "google-sheets",
          actionType: "write",
          actionKey: "add_row",
          connection: "google-sheets",
          inputs: {
            spreadsheet: SPREADSHEET_ID,
            worksheet: WORKSHEET_ID,
            [DATE_COLUMN]: article.date,
            [TITLE_COLUMN]: article.title,
            [LINK_COLUMN]: article.link,
            [HEADLINE_COLUMN]: article.headline,
            [SUMMARY_COLUMN]: article.summary,
          },
        }),
      );
    }

    return { date: today, logged: result.items.length };
  },
);

export default workflow;
