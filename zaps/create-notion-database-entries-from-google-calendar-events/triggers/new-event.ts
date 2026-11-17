// What starts the zap: a new event on the calendar in Google Calendar.
export default {
  app: "google-calendar",
  event: "new_event",
  connection: "google-calendar",
  params: {
    // Ask the user which Google Calendar holds the events to log, then look up its ID with their Google Calendar connection.
    calendarid: "REPLACE_CALENDAR_ID",
  },
};
