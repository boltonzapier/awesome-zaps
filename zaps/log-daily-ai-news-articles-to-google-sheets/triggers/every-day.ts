export default {
  app: "schedule",
  event: "everyDay",
  params: {
    // Evening run, so the search covers the day's coverage. Time is in the account's timezone.
    hod: "8:00 PM",
    weekends: "yes",
  },
};
