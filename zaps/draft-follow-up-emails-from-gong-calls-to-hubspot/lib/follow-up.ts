// Pure helpers that turn Gong's call payloads into the inputs for the follow-up email.

export type Party = {
  name?: string | null;
  title?: string | null;
  emailAddress?: string | null;
  affiliation?: string | null;
  speakerId?: string | null;
  userId?: string | null;
  company?: string | null;
};

export type CallDetails = {
  metaData?: { primaryUserId?: string | null } | null;
  parties?: Party[] | null;
};

export type CallsPayload = { calls?: CallDetails[] };

type Transcript = {
  callTranscripts?: {
    transcript?: {
      speakerId?: string | null;
      sentences?: { text: string }[];
    }[];
  }[];
};

type EmailParty = Party & { emailAddress: string };

export type Recipients = {
  to: EmailParty;
  cc: EmailParty[];
  host: EmailParty;
};

const partiesOf = (call: CallDetails): Party[] => call.parties ?? [];

// Gong marks the person who scheduled the call as the primary user.
export function organizerEmail(call: CallDetails): string | null {
  const primary = call.metaData?.primaryUserId;
  if (!primary) return null;
  return (
    partiesOf(call).find((p) => p.userId === primary)?.emailAddress ?? null
  );
}

// The first external attendee is the recipient, other external attendees are copied,
// and the first internal attendee is the host who sends the email.
export function recipients(call: CallDetails): Recipients | null {
  const withEmail = partiesOf(call).filter((p): p is EmailParty =>
    Boolean(p.emailAddress),
  );
  const external = withEmail.filter((p) => p.affiliation === "External");
  const host = withEmail.find((p) => p.affiliation === "Internal");
  if (external.length === 0 || !host) return null;
  return { to: external[0], cc: external.slice(1), host };
}

export function attendeeList(call: CallDetails): string {
  return partiesOf(call)
    .map((p) => {
      const email = p.emailAddress ? `: ${p.emailAddress}` : "";
      return `- ${p.name ?? "Unknown"} (${p.affiliation ?? "unknown affiliation"})${email}`;
    })
    .join("\n");
}

// Speaker turns are labelled "Name, Title, Company" and consecutive turns by the same speaker are joined.
export function readableScript(
  transcriptJson: string,
  call: CallDetails,
): string {
  const labels = new Map<string, string>();
  for (const p of partiesOf(call)) {
    if (p.speakerId) {
      labels.set(
        p.speakerId,
        `${p.name ?? `Unknown (${p.speakerId})`}, ${p.title ?? "(No Title)"}, ${companyOf(p)}`,
      );
    }
  }

  const transcript = JSON.parse(transcriptJson) as Transcript;
  const turns = transcript.callTranscripts?.[0]?.transcript ?? [];
  const blocks: { label: string; text: string }[] = [];
  for (const turn of turns) {
    const id = turn.speakerId ?? "Unknown";
    const label = labels.get(id) ?? `Unknown (${id})`;
    const text = (turn.sentences ?? []).map((s) => s.text.trim()).join(" ");
    const last = blocks[blocks.length - 1];
    if (last && last.label === label) {
      last.text += ` ${text}`;
    } else {
      blocks.push({ label, text });
    }
  }
  return blocks.map((b) => `${b.label}: ${b.text}`).join("\n\n");
}

// Gong does not always send a company, so the email domain stands in for it.
function companyOf(p: Party): string {
  if (p.company) return p.company;
  const domain = p.emailAddress?.split("@")[1];
  if (!domain) return "Unknown";
  return domain.split(".").slice(0, -1).join(".") || domain;
}

export function gmailDraftUrl(
  to: string,
  subject: string,
  body: string,
): string {
  const query = [
    ["to", to],
    ["su", subject],
    ["body", body],
  ]
    .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
    .join("&");
  return `https://mail.google.com/mail/?view=cm&fs=1&${query}`;
}
