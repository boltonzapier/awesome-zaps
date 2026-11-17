// Lead fields arrive from different sources in different shapes. Sources send this placeholder for fields they don't have.
const MISSING = "missing sample data";

export function clean(value: string | null | undefined): string {
  const text = (value ?? "").trim();
  return text.toLowerCase() === MISSING ? "" : text;
}

// Some sources send first and last name, others a single full name. Split the full name only when neither part is present.
export function splitName(
  first: string | null | undefined,
  last: string | null | undefined,
  full: string | null | undefined,
): { firstName: string; lastName: string } {
  const firstName = clean(first);
  const lastName = clean(last);
  if (firstName || lastName) return { firstName, lastName };

  const [given = "", ...family] = clean(full).split(/\s+/).filter(Boolean);
  return { firstName: given, lastName: family.join(" ") };
}

// HubSpot's company-size buckets. A range such as "250-500" maps by its lower bound; anything unparseable maps to blank.
export function employeesRange(raw: string | null | undefined): string {
  const text = clean(raw).replace(" to ", "-");
  if (!text.includes("-")) return "";

  const min = Number(text.split("-")[0]);
  if (Number.isNaN(min) || min < 1) return "";
  if (min <= 5) return "1-5";
  if (min <= 25) return "5-25";
  if (min <= 50) return "25-50";
  if (min <= 100) return "50-100";
  if (min <= 500) return "100-500";
  if (min <= 1000) return "500-1000";
  return "1000+";
}
