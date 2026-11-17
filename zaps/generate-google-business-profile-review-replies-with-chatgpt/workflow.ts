import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { INSTRUCTIONS, MODEL, NAME_FALLBACK } from "./config.ts";

const sdk = createZapierSdk();

// Review payload from the New Review trigger. Keys are Zapier's flattened keys.
const InputSchema = z
  .object({
    id: z.string().nullable().optional(),
    name: z.string(),
    comment: z.string().nullable().optional(),
    starRating: z.string().nullable().optional(),
    reviewer__displayName: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "generate-google-business-profile-review-replies-with-chatgpt",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const firstName =
      (input.reviewer__displayName ?? "").trim().split(/\s+/)[0] ||
      NAME_FALLBACK;
    const reviewMessage = [
      `Reviewer first name: ${firstName}`,
      `Star rating: ${input.starRating ?? "not given"}`,
      `Review: ${input.comment?.trim() || "(no written comment)"}`,
    ].join("\n");

    const generated = await ctx.step("write-reply-with-chatgpt", async () =>
      sdk.runAction({
        appKey: "chatgpt",
        actionType: "write",
        actionKey: "conversation_responses_api",
        connection: "chatgpt",
        inputs: {
          model: MODEL,
          instructions: INSTRUCTIONS,
          user_message: reviewMessage,
          response_format: "text",
        },
      }),
    );

    // An empty reply is never posted under a public review.
    const reply = String(
      (generated.data?.[0] as { output?: string } | undefined)?.output ?? "",
    ).trim();
    if (!reply) {
      return {
        skipped: true,
        reason: "empty-reply",
        reviewId: input.id ?? null,
      };
    }

    const posted = await ctx.step("post-review-reply", async () =>
      sdk.runAction({
        appKey: "google-business-profile",
        actionType: "write",
        actionKey: "create_reply",
        connection: "google-business-profile",
        inputs: {
          reply,
          review_name: input.name,
        },
      }),
    );

    return {
      reviewId: input.id ?? null,
      reply,
      updated: posted.data?.[0] ?? null,
    };
  },
);

export default workflow;
