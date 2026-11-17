import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  APPROVE_BUTTON_KEY,
  REJECT_BUTTON_KEY,
  APPROVED_MESSAGE,
  REJECTED_MESSAGE,
} from "./config.ts";

const sdk = createZapierSdk();

// The record whose button was clicked, as the Zapier Tables button trigger delivers it.
// `field_data_key` names the button; `new.data.f3` is the requester's Slack username.
const InputSchema = z
  .object({
    field_data_key: z.string().nullable().optional(),
    new: z
      .object({
        data: z
          .object({
            f3: z.string().nullable().optional(),
          })
          .loose(),
      })
      .loose(),
  })
  .loose();

const workflow = defineDurable(
  "send-slack-dm-for-zapier-tables-approval-decisions",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const message =
      input.field_data_key === APPROVE_BUTTON_KEY
        ? APPROVED_MESSAGE
        : input.field_data_key === REJECT_BUTTON_KEY
          ? REJECTED_MESSAGE
          : null;
    if (!message) {
      return { skipped: true, reason: "not-an-approval-button" };
    }

    // Slack usernames are typed into the table, sometimes with a leading @.
    const username = (input.new.data.f3 ?? "").trim().replace(/^@/, "");
    if (!username) {
      return { skipped: true, reason: "no-slack-username" };
    }

    const requester = await ctx.step("find-requester-in-slack", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "search",
        actionKey: "user_by_username",
        connection: "slack",
        inputs: { username },
      }),
    );

    const requesterId = (requester.data[0] as { id?: string } | undefined)?.id;
    if (!requesterId) {
      return { skipped: true, reason: "requester-not-found", username };
    }

    const sent = await ctx.step("send-decision-dm", async () =>
      sdk.runAction({
        appKey: "slack",
        actionType: "write",
        actionKey: "direct_message",
        connection: "slack",
        inputs: {
          channel: requesterId,
          text: message,
          as_bot: "yes",
          unfurl: "no",
          link_names: "no",
          send_multi: "no",
          add_edit_link: "no",
        },
      }),
    );

    return {
      sent: true,
      requesterId,
      message: sent.data[0] ?? null,
    };
  },
);

export default workflow;
