// Slack channel names are lowercase letters, digits, hyphens and underscores, at most 80 characters.
export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// Parsed as text, not with Date: the durable runtime forbids Date outside a step.
export function halfOfYear(isoDate: string): string {
  const [year, month] = isoDate.trim().slice(0, 10).split("-");
  const half = Number(month) <= 6 ? "H1" : "H2";
  return `${year}-${half}`;
}

export function hiringChannelName(
  roleTitle: string,
  createdAt: string,
): string {
  return `hire-${slugify(roleTitle)}-position-${halfOfYear(createdAt)}`
    .toLowerCase()
    .slice(0, 80)
    .replace(/-$/, "");
}
