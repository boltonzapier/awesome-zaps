import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { DRIVE_FOLDER_ID } from "./config.ts";

const sdk = createZapierSdk();

// The attachment as the Gmail New Attachment trigger delivers it. It is passed to Drive as-is,
// so the file keeps the name it arrived with.
const InputSchema = z
  .object({
    message_id: z.string(),
    filename: z.string(),
    attachment: z.unknown(),
  })
  .loose();

const workflow = defineDurable(
  "save-new-gmail-attachments-to-google-drive",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const upload = await ctx.step("upload-attachment-to-drive", async () =>
      sdk.runAction({
        appKey: "google-drive",
        actionType: "write",
        actionKey: "file",
        connection: "google-drive",
        inputs: {
          file: input.attachment,
          folder: DRIVE_FOLDER_ID,
        },
      }),
    );

    return {
      messageId: input.message_id,
      filename: input.filename,
      file: upload.data[0] ?? null,
    };
  },
);

export default workflow;
