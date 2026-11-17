// Weekly on Wednesday at 7:00 AM Pacific, as in the source template. "dow" counts from 0 = Monday.
export default {
  app: "schedule",
  event: "everyWeek",
  params: {
    dow: ["2"],
    hod: "7:00 AM",
    timezone_override: "America/Los_Angeles",
  },
};
