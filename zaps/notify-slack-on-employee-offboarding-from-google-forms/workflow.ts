import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  TERMINATIONS_TABLE_ID,
  COL_FULL_NAME,
  COL_LAST_DAY,
  COL_COMPANY_EMAIL,
  COL_PERSONAL_EMAIL,
  COL_TERM_TYPE,
  COL_JOB_LEVEL,
  COL_REASON,
  COL_REHIRE,
  PAYROLL_CHANNEL_ID,
  IT_CHANNEL_ID,
  ACCOUNTING_CHANNEL_ID,
  TOTAL_REWARDS_CHANNEL_ID,
  TAX_CHANNEL_ID,
  PBP_SLACK_USER_ID,
} from "./config.ts";
import { tenureInYears } from "./lib/tenure.ts";
import { buildNotices, type Team } from "./lib/notifications.ts";

const sdk = createZapierSdk();

// Form answers are keyed by Google Forms question ID. Check each key against the live form before the
// first run, since a question added or re-created gets a new ID.
const InputSchema = z
  .object({
    createTime: z.string(),
    "65986356": z.string(), // terminated employee's company email
    "6f464119": z.string(), // full name
    "35d27a95": z.string(), // last day
    "5a79443a": z.string(), // personal email
    "57c8e978": z.string(), // job level
    "42c34030": z.string(), // termination type
    "35cda77c": z.string().nullable().optional(), // is a manager
    "37726d14": z.string().nullable().optional(), // reports move to
    "29a30e0d": z.string().nullable().optional(), // reason
    "1fb110a1": z.string().nullable().optional(), // rehire
    "5e418b2f": z.string().nullable().optional(), // severance expected (involuntary)
    "10c9e9d3": z.string().nullable().optional(), // access removal date (involuntary)
    "0919169e": z.string().nullable().optional(), // notice period weeks
  })
  .loose();

const CHANNELS: Record<Team, { id: string; isPrivate: boolean }> = {
  payroll: { id: PAYROLL_CHANNEL_ID, isPrivate: true },
  it: { id: IT_CHANNEL_ID, isPrivate: true },
  accounting: { id: ACCOUNTING_CHANNEL_ID, isPrivate: true },
  "total-rewards": { id: TOTAL_REWARDS_CHANNEL_ID, isPrivate: true },
  tax: { id: TAX_CHANNEL_ID, isPrivate: false },
};

const workflow = defineDurable(
  "notify-slack-on-employee-offboarding-from-google-forms",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    const companyEmail = input["65986356"].trim().toLowerCase();

    const found = await ctx.step("find-bamboohr-employee", async () =>
      sdk.runAction({
        appKey: "bamboohr",
        actionType: "search",
        actionKey: "employeeSearch",
        connection: "bamboohr",
        inputs: { search_by: "email", search_term: companyEmail },
      }),
    );

    const hris = found.data?.[0] as
      | {
          country?: string;
          state?: string;
          department?: string;
          hireDate?: string;
          workEmail?: string;
          employeeNumber?: string;
          id?: string;
        }
      | undefined;

    const termination = {
      name: input["6f464119"],
      lastDay: input["35d27a95"],
      termType: input["42c34030"],
      jobLevel: input["57c8e978"],
      isManager: input["35cda77c"] ?? "",
      reportsMoveTo: input["37726d14"] ?? "",
      reason: input["29a30e0d"] ?? "",
      rehire: input["1fb110a1"] ?? "",
      personalEmail: input["5a79443a"],
      accessRemovalDate: input["10c9e9d3"] ?? "",
      severanceExpected: input["5e418b2f"] ?? "",
      noticeWeeks: input["0919169e"] ?? "",
    };

    const employee = {
      country: hris?.country ?? "",
      state: hris?.state ?? "",
      department: hris?.department ?? "",
      hireDate: hris?.hireDate ?? "",
      workEmail: hris?.workEmail ?? companyEmail,
      employeeNumber: hris?.employeeNumber ?? "",
      id: hris?.id ?? "",
    };

    const tenureYears = tenureInYears(employee.hireDate, termination.lastDay);

    await ctx.step("log-termination-record", async () =>
      sdk.runAction({
        appKey: "zapier-tables",
        actionType: "write",
        actionKey: "create_record",
        connection: "zapier-tables",
        inputs: {
          table_id: TERMINATIONS_TABLE_ID,
          [`new__data__${COL_FULL_NAME}`]: termination.name,
          [`new__data__${COL_LAST_DAY}`]: termination.lastDay,
          [`new__data__${COL_COMPANY_EMAIL}`]: companyEmail,
          [`new__data__${COL_PERSONAL_EMAIL}`]: termination.personalEmail,
          [`new__data__${COL_TERM_TYPE}`]: termination.termType,
          [`new__data__${COL_JOB_LEVEL}`]: termination.jobLevel,
          [`new__data__${COL_REASON}`]: termination.reason,
          [`new__data__${COL_REHIRE}`]: termination.rehire,
        },
      }),
    );

    const notices = buildNotices(
      termination,
      employee,
      tenureYears,
      PBP_SLACK_USER_ID,
    );

    const posted: string[] = [];
    for (const notice of notices) {
      const channel = CHANNELS[notice.team];
      await ctx.step(`post-to-${notice.team}`, async () =>
        sdk.runAction({
          appKey: "slack",
          actionType: "write",
          actionKey: channel.isPrivate
            ? "private_channel_message"
            : "channel_message",
          connection: "slack",
          inputs: {
            channel: channel.id,
            text: notice.text,
            username: notice.username,
            icon: ":bye:",
            as_bot: "yes",
            unfurl: "no",
            link_names: "yes",
            add_edit_link: "no",
            reply_broadcast: "no",
            add_app_to_channel: "yes",
          },
        }),
      );
      posted.push(notice.team);
    }

    return {
      createTime: input.createTime,
      termType: termination.termType,
      tenureYears,
      posted,
    };
  },
);

export default workflow;
