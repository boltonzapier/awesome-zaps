export type Party = { emailAddress?: string | null; speakerId?: string | null };
export type Stat = { name: string; value?: string | number | null };

export function speakerIdForEmail(
  parties: Party[],
  email: string,
): string | null {
  const match = parties.find(
    (party) => (party.emailAddress ?? "").toLowerCase() === email.toLowerCase(),
  );
  return match?.speakerId ?? null;
}

// Gong's speaker IDs are per call. The rep's turns are labelled so the feedback can refer to them.
export function labelTranscript(
  rawTranscript: string,
  repSpeakerId: string,
  speakerIds: string[],
): string {
  const parsed = JSON.parse(rawTranscript);
  const turns: { speakerId: string; sentences: { text: string }[] }[] =
    parsed.callTranscripts?.[0]?.transcript ?? [];

  const labels = new Map<string, string>();
  let otherCount = 1;
  for (const id of speakerIds) {
    if (id === repSpeakerId) {
      labels.set(id, "Sales Rep");
    } else if (!labels.has(id)) {
      labels.set(id, `Speaker ${otherCount++}`);
    }
  }

  return turns
    .map((turn) => {
      const label = labels.get(turn.speakerId) ?? turn.speakerId;
      return `${label}: ${turn.sentences.map((s) => s.text).join(" ")}`;
    })
    .join("\n");
}

export function formatStats(stats: Stat[]): string {
  return stats
    .map((stat) => `${stat.name}: ${stat.value ?? "unknown"}`)
    .join("\n");
}

export function statValue(stats: Stat[], name: string): number | null {
  const stat = stats.find((s) => s.name === name);
  if (stat?.value === undefined || stat.value === null) return null;
  const value = Number(stat.value);
  return Number.isNaN(value) ? null : value;
}

export function totalScore(scores: number[]): number {
  return scores.reduce((sum, score) => sum + score, 0);
}

export function tableCell(
  record: Record<string, unknown>,
  key: string,
): string {
  return String(record[key] ?? "");
}
