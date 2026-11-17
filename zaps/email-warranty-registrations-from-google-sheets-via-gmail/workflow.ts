import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  SPREADSHEET_ID,
  WORKSHEET_ID,
  CUSTOMER_NAME_HEADER,
  CUSTOMER_EMAIL_HEADER,
  DISCOUNT_CODE,
  EMAIL_SUBJECT,
} from "./config.ts";

const sdk = createZapierSdk();

// The changed row as the Google Sheets trigger delivers it: one key per column header.
// The headers are set in config.ts, so the row is read as a loose object.
const InputSchema = z.object({}).loose();

const workflow = defineDurable(
  "email-warranty-registrations-from-google-sheets-via-gmail",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const email = String(input[CUSTOMER_EMAIL_HEADER] ?? "").trim();
    if (!email) {
      return { skipped: true, reason: "no-email" };
    }

    const name = String(input[CUSTOMER_NAME_HEADER] ?? "").trim() || "there";

    const sent = await ctx.step("send-warranty-email", async () =>
      sdk.runAction({
        appKey: "gmail",
        actionType: "write",
        actionKey: "message",
        connection: "gmail",
        inputs: {
          to: [email],
          subject: EMAIL_SUBJECT,
          body_type: "html",
          body: [
            `<p>Hi ${name},</p>`,
            "<p>Thank you for registering your warranty with us. Your registration is on file.</p>",
            `<p>As a thank you, here is a discount on your next order: <strong>${DISCOUNT_CODE}</strong></p>`,
            "<p>Keep this email for your records. Reply to it if you have any questions.</p>",
          ].join(""),
        },
      }),
    );

    return {
      email,
      sent: sent.data?.[0] ?? null,
    };
  },
);

export default workflow;
