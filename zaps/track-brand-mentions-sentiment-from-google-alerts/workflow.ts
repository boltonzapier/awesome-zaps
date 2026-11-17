import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TABLE_ID,
  SLACK_CHANNEL_ID,
  HEADLINE_FIELD,
  SUMMARY_FIELD,
  SENTIMENT_FIELD,
  QUOTES_FIELD,
  ARTICLE_URL_FIELD,
  PUBLISHED_AT_FIELD,
  LOGGED_AT_FIELD,
  BOT_NAME,
  MODEL_ID,
  MAX_ARTICLE_CHARS,
} from "./config.ts";

const sdk = createZapierSdk();

const INSTRUCTIONS = `You read one news article from the web and report how it covers a brand. The brand's name is the one in the Google Alert that found the article. Use only the article text you are given. Write plain sentences, no markdown.

- headline: the article's headline.
- summary: two or three sentences on what the article says.
- sentiment: how the article portrays the brand: Positive, Neutral, Negative or Mixed.
- quotes: each direct quote from a person about the brand, with the speaker's name, title and company where the article gives them. One quote per line. Leave empty if there are none.`;

// The new item as the RSS trigger delivers it. Only the link is needed to fetch the article.
const InputSchema = z
  .object({
    title: z.string().nullable().optional(),
    link: z.string(),
    pubDate: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "track-brand-mentions-sentiment-from-google-alerts",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const page = await ctx.step("fetch-article-page", async () =>
      sdk.runAction({
        appKey: "webhook",
        actionType: "write",
        actionKey: "custom",
        inputs: {
          url: input.link,
          method: "GET",
          unflatten: "no",
          return_raw_response: "yes",
        },
      }),
    );

    const articleHtml = String(page.data?.[0] ?? "").slice(
      0,
      MAX_ARTICLE_CHARS,
    );

    const analysis = await ctx.step("analyze-mention-with-ai", async () =>
      sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        connection: "ai",
        inputs: {
          model_id: MODEL_ID,
          authentication_id: "0",
          instructions: INSTRUCTIONS,
          inputFields: { article_html: articleHtml },
          includeWorkflowData: false,
          outputFields: [
            { name: "headline", type: "text", isRequired: true },
            { name: "summary", type: "text", isRequired: true },
            {
              name: "sentiment",
              type: "category_single",
              options: ["Positive", "Neutral", "Negative", "Mixed"],
              isRequired: true,
            },
            { name: "quotes", type: "text", isRequired: false },
          ],
        },
      }),
    );

    const result = (analysis.data[0] ?? {}) as Record<string, unknown>;
    const field = (name: string) => String(result[name] ?? "").trim();
    const headline = field("headline") || input.title || input.link;
    const sentiment = field("sentiment");
    const summary = field("summary");
    const quotes = field("quotes");

    const publishedAt = input.pubDate
      ? new Date(input.pubDate).toISOString()
      : "";

    const loggedAt = await ctx.step("capture-logged-at", async () =>
      new Date().toISOString(),
    );

    const row = await ctx.step("save-mention-to-table", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TABLE_ID,
          [HEADLINE_FIELD]: headline,
          [SUMMARY_FIELD]: summary,
          [SENTIMENT_FIELD]: sentiment,
          [QUOTES_FIELD]: quotes,
          [ARTICLE_URL_FIELD]: input.link,
          [PUBLISHED_AT_FIELD]: publishedAt,
          [LOGGED_AT_FIELD]: loggedAt,
        },
      }),
    );

    const quoteLine = quotes ? `\n> ${quotes.replace(/\n/g, "\n> ")}` : "";

    const post = await ctx.step("post-mention-to-slack", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "channel_message",
        connection: "slack",
        inputs: {
          channel: SLACK_CHANNEL_ID,
          username: BOT_NAME,
          as_bot: "yes",
          unfurl: "no",
          add_edit_link: "no",
          text: `*${headline}* (${sentiment || "sentiment unclear"})\n${summary}\n${input.link}${quoteLine}`,
        },
      }),
    );

    return {
      link: input.link,
      headline,
      sentiment,
      row: row.data?.[0] ?? null,
      slack: post.data?.[0] ?? null,
    };
  },
);

export default workflow;
