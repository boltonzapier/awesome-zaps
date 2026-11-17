// Moves an ISO timestamp forward by whole Monday-to-Friday days, keeping its UTC time of day.
// Weekends are skipped so the manager's message lands after the employee has had three working days to edit.
export function addBusinessDays(isoTimestamp: string, days: number): string {
  const date = new Date(isoTimestamp);
  let remaining = days;
  while (remaining > 0) {
    date.setUTCDate(date.getUTCDate() + 1);
    const weekday = date.getUTCDay();
    if (weekday !== 0 && weekday !== 6) remaining -= 1;
  }
  return date.toISOString();
}
