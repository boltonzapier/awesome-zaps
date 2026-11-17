import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  QUOTE_TABLE_ID,
  QUOTE_ID_FIELD,
  OWNER_ID_FIELD,
  DEAL_ID_FIELD,
  QUOTE_LINK_FIELD,
  CONCESSIONS_FIELD,
  APPROVAL_CHANNEL_ID,
  APPROVER_MENTIONS,
  HUBSPOT_PORTAL_ID,
  APPROVAL_BOT_NAME,
} from "./config.ts";

const sdk = createZapierSdk();

// The HubSpot quote-ready payload. Concessions arrive as extra keys that vary per quote, so the
// schema is loose and every key other than the three below is listed as a concession.
const InputSchema = z
  .object({
    quote_id: z.union([z.string(), z.number()]).nullable().optional(),
    deal_id: z.union([z.string(), z.number()]).nullable().optional(),
    hs_quote_owner_id: z.union([z.string(), z.number()]).nullable().optional(),
  })
  .loose();

const KNOWN_KEYS = ["quote_id", "deal_id", "hs_quote_owner_id"];

const workflow = defineDurable(
  "post-hubspot-quote-approval-requests-to-slack",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const quoteId = String(input.quote_id ?? "").trim();
    if (!quoteId) {
      return { skipped: true, reason: "no-quote-id" };
    }

    const dealId = String(input.deal_id ?? "").trim();
    const ownerId = String(input.hs_quote_owner_id ?? "").trim();

    const concessions = Object.entries(input)
      .filter(
        ([key, value]) =>
          !KNOWN_KEYS.includes(key) &&
          value !== null &&
          value !== undefined &&
          String(value).trim() !== "",
      )
      .map(([key, value]) => `• ${key}: ${String(value)}`)
      .join("\n");

    const quoteLink = `https://app.hubspot.com/quotes/${HUBSPOT_PORTAL_ID}/approve/${quoteId}`;

    const record = await ctx.step(`log-quote-${quoteId}`, async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: QUOTE_TABLE_ID,
          [`new__data__${QUOTE_ID_FIELD}`]: quoteId,
          [`new__data__${OWNER_ID_FIELD}`]: ownerId,
          [`new__data__${DEAL_ID_FIELD}`]: dealId,
          [`new__data__${QUOTE_LINK_FIELD}`]: quoteLink,
          [`new__data__${CONCESSIONS_FIELD}`]: concessions,
        },
      }),
    );

    const message = await ctx.step(
      `post-approval-request-${quoteId}`,
      async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "write",
          actionKey: "channel_message",
          connection: "slack",
          inputs: {
            channel: APPROVAL_CHANNEL_ID,
            username: APPROVAL_BOT_NAME,
            link_names: "yes",
            text: [
              `:loudspeaker: ${APPROVER_MENTIONS} please review HubSpot quote ${quoteId}. Discuss it in this thread.`,
              "",
              "*Quote details*",
              `• <https://app.hubspot.com/contacts/${HUBSPOT_PORTAL_ID}/record/0-3/${dealId}|Link to HubSpot deal>`,
              `• <${quoteLink}|Link to HubSpot quote>`,
              "",
              "*Concessions for review*",
              concessions || "None listed.",
            ].join("\n"),
          },
        }),
    );

    return {
      quoteId,
      dealId,
      record: record.data[0] ?? null,
      message: message.data[0] ?? null,
    };
  },
);

export default workflow;
