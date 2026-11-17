// The Slack messages sent to each team for one termination. Pure: the workflow decides where each
// one goes and sends it.

export type Team = "payroll" | "it" | "accounting" | "total-rewards" | "tax";

export type Notice = {
  team: Team;
  username: string;
  text: string;
  isPrivate: boolean;
};

export type Termination = {
  name: string;
  lastDay: string;
  termType: string;
  jobLevel: string;
  isManager: string;
  reportsMoveTo: string;
  reason: string;
  rehire: string;
  personalEmail: string;
  accessRemovalDate: string;
  severanceExpected: string;
  noticeWeeks: string;
};

export type Employee = {
  country: string;
  state: string;
  department: string;
  hireDate: string;
  workEmail: string;
  employeeNumber: string;
  id: string;
};

export function buildNotices(
  t: Termination,
  e: Employee,
  tenureYears: number,
  pbpSlackId: string,
): Notice[] {
  const voluntary = t.termType.toLowerCase() === "voluntary";
  const location = `${e.country}, ${e.state}`;

  if (voluntary) {
    return [
      {
        team: "payroll",
        username: "Voluntary Termination",
        isPrivate: true,
        text: [
          "Please review the following and begin the tasks for offboarding:",
          `*Employee:* ${t.name}`,
          `*Final Pay Date:* ${t.lastDay}`,
          `*Location:* ${location}`,
          `*Department:* ${e.department}`,
          `*Level:* ${t.jobLevel}`,
          `*Type:* ${t.termType}`,
          `*Is manager:* ${t.isManager}`,
          `*If yes, reports move to:* ${t.reportsMoveTo}`,
          `*Reason for leaving:* ${t.reason}`,
          `*Rehire:* ${t.rehire}`,
          `*Tenure:* ${tenureYears} years`,
          `*PBP:* <@${pbpSlackId}>`,
          "_If less than 6 months (.5 years), the employee will need to return their laptop, and if less than 1 year, clawbacks for any sign-on bonus will need to be reviewed_",
        ].join("\n"),
      },
      {
        team: "it",
        username: "Termination",
        isPrivate: true,
        text: `*Termination Notification*\n*Employee name:* ${t.name}\n*Last day:* ${t.lastDay}`,
      },
      {
        team: "accounting",
        username: "Voluntary Termination",
        isPrivate: true,
        text: [
          "Please review the following and begin the tasks for offboarding:",
          `*Employee:* ${t.name}`,
          `*Final Pay Date:* ${t.lastDay}`,
          `*Location:* ${location}`,
          `*Department:* ${e.department}`,
          `*Type:* ${t.termType}`,
          `*EID:* ${e.id}`,
          `*Tenure:* ${tenureYears} years`,
          `*Hire Date:* ${e.hireDate}`,
          `*Email:* ${e.workEmail}`,
        ].join("\n"),
      },
      {
        team: "total-rewards",
        username: "Voluntary Termination",
        isPrivate: true,
        text: [
          "Please review the following and begin the tasks for offboarding:",
          `*Employee:* ${t.name}`,
          `*Final Pay Date:* ${t.lastDay}`,
          `*Location:* ${location}`,
          `*Department:* ${e.department}`,
          `*Type:* ${t.termType}`,
          `*Zapier Number:* ${e.employeeNumber}`,
          `*Tenure:* ${tenureYears} years`,
          `*Hire Date:* ${e.hireDate}`,
          `*Personal Email:* ${t.personalEmail}`,
        ].join("\n"),
      },
      {
        team: "tax",
        username: "Offboarding Bot",
        isPrivate: false,
        text: `*Employee:* ${t.name}\n*Last day:* ${t.lastDay}\n*Country:* ${e.country}\n*Department:* ${e.department}\n*Level:* ${t.jobLevel}`,
      },
    ];
  }

  return [
    {
      team: "payroll",
      username: "Involuntary Termination",
      isPrivate: true,
      text: [
        "*An involuntary termination has been submitted.* Please review it and begin the tasks for offboarding:",
        `*Employee:* ${t.name}`,
        `*Access Removal Date:* ${t.accessRemovalDate}`,
        `*Final Pay Date:* ${t.lastDay}`,
        `*Location:* ${location}`,
        `*Department:* ${e.department}`,
        `*Level:* ${t.jobLevel}`,
        `*Type:* ${t.termType}`,
        `*Severance:* ${t.severanceExpected}`,
        `*Is manager:* ${t.isManager}`,
        `*If yes, reports move to:* ${t.reportsMoveTo}`,
        `*Reason for term:* ${t.reason}`,
        `*Rehire:* ${t.rehire}`,
        `*Personal Email:* ${t.personalEmail}`,
        `*Tenure:* ${tenureYears} years`,
        `*PBP:* <@${pbpSlackId}>`,
      ].join("\n"),
    },
    {
      team: "it",
      username: "Involuntary Termination",
      isPrivate: true,
      text: `*Termination Notification*\n*Employee name:* ${t.name}\n*Access Removal Date:* ${t.accessRemovalDate}`,
    },
    {
      team: "accounting",
      username: "Involuntary Termination",
      isPrivate: true,
      text: [
        "Please review the involuntary termination and begin the tasks for offboarding:",
        `*Employee:* ${t.name}`,
        `*Access Removal Date:* ${t.accessRemovalDate}`,
        `*Final Pay Date:* ${t.lastDay}`,
        `*Location:* ${location}`,
        `*Department:* ${e.department}`,
        `*Type:* ${t.termType}`,
        `*EID:* ${e.id}`,
        `*Tenure:* ${tenureYears} years`,
        `*Hire Date:* ${e.hireDate}`,
        `*Email:* ${e.workEmail}`,
      ].join("\n"),
    },
    {
      team: "total-rewards",
      username: "Involuntary Termination",
      isPrivate: true,
      text: [
        "Please review the involuntary termination and begin the tasks for offboarding:",
        `*Employee:* ${t.name}`,
        `*Access Removal Date:* ${t.accessRemovalDate}`,
        `*Final Pay Date:* ${t.lastDay}`,
        `*Location:* ${location}`,
        `*Severance Expected?:* ${t.severanceExpected}`,
        `*Notice Period Weeks:* ${t.noticeWeeks}`,
        `*Department:* ${e.department}`,
        `*Type:* ${t.termType}`,
        `*Reason:* ${t.reason}`,
        `*Zapier Number:* ${e.employeeNumber}`,
        `*Tenure:* ${tenureYears} years`,
        `*Hire Date:* ${e.hireDate}`,
        `*Personal Email:* ${t.personalEmail}`,
      ].join("\n"),
    },
    {
      team: "tax",
      username: "Offboarding Bot",
      isPrivate: false,
      text: `*Employee:* ${t.name}\n*Last day:* ${t.lastDay}\n*Country:* ${e.country}\n*Department:* ${e.department}\n*Level:* ${t.jobLevel}`,
    },
  ];
}
