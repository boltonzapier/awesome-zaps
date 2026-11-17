import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  YOUTUBE_PRIVACY,
  DEFAULT_DESCRIPTION,
  TITLE_LENGTH,
} from "./config.ts";

const sdk = createZapierSdk();

// The new Drive file as the New File trigger delivers it. Every field is optional except the
// id, because Drive files differ in what they carry.
const InputSchema = z
  .object({
    id: z.string(),
    title: z.string().nullable().optional(),
    description: z.string().nullable().optional(),
    mimeType: z.string().nullable().optional(),
    file: z.string().nullable().optional(),
  })
  .loose();

const workflow = defineDurable(
  "upload-new-google-drive-videos-to-youtube",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    // The trigger fires for every new file in Drive; only videos are uploaded.
    if (!input.mimeType?.startsWith("video/") || !input.file) {
      return { skipped: true, reason: "not-a-video", id: input.id };
    }

    // The file name without its extension becomes the YouTube title.
    const title = (input.title ?? "Untitled video")
      .replace(/\.[^.]+$/, "")
      .slice(0, TITLE_LENGTH);
    const description = input.description?.trim() || DEFAULT_DESCRIPTION;

    const upload = await ctx.step(
      `upload-youtube-video-${input.id}`,
      async () =>
        sdk.runAction({
          appKey: "youtube",
          actionType: "write",
          actionKey: "upload_video",
          connection: "youtube",
          inputs: {
            file: input.file,
            title,
            description,
            privacy_status: YOUTUBE_PRIVACY,
          },
        }),
    );

    const video = upload.data?.[0] as { id?: string } | undefined;

    return {
      id: input.id,
      title,
      videoId: video?.id ?? null,
      videoUrl: video?.id
        ? `https://www.youtube.com/watch?v=${video.id}`
        : null,
    };
  },
);

export default workflow;
