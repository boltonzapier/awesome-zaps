import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import { GMAIL_LINK_BASE, WHATSAPP_TEMPLATE } from "./config.ts";

const sdk = createZapierSdk();

// The new email as the Gmail trigger delivers it. Only the fields the message uses are named.
const InputSchema = z
  .object({
    id: z.string(),
    from__name: z.string().nullable().optional(),
    from__email: z.string().nullable().optional(),
  })
  .loose();

export default defineDurable(
  "notify-whatsapp-new-gmail",
  async (ctx, input) => {
    const email = InputSchema.parse(input);
    const sender = email.from__name || email.from__email || "unknown sender";
    const link = `${GMAIL_LINK_BASE}${email.id}`;

    return ctx.step("send-whatsapp-notification", () =>
      sdk.runAction({
        appKey: "whatsapp-notifications",
        actionType: "write",
        actionKey: "send_message",
        connection: "whatsapp-notifications",
        inputs: {
          template: WHATSAPP_TEMPLATE,
          name: sender,
          link_to_reply: link,
        },
      }),
    );
  },
);
