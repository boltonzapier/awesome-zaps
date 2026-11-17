export type Segment = {
  speaker: string;
  text: string;
  duration: number;
  wordCount: number;
};

const TIME_LINE = /^(\d{2}:\d{2}:\d{2}\.\d{3}) --> (\d{2}:\d{2}:\d{2}\.\d{3})/;

function toSeconds(time: string): number {
  const [hours, minutes, seconds] = time.split(":");
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

// Turns a WebVTT transcript into speaker turns. Zoom writes "Name: text" on the first
// line of each cue, and cues from the same speaker are merged into one turn.
export function parseVttSegments(vtt: string): Segment[] {
  const lines = vtt
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const cues: { speaker: string; text: string; seconds: number }[] = [];
  let i = 0;
  while (i < lines.length) {
    const time = lines[i].match(TIME_LINE);
    if (!time) {
      i++;
      continue;
    }
    const seconds = toSeconds(time[2]) - toSeconds(time[1]);
    i++;

    const body: string[] = [];
    while (i < lines.length && !TIME_LINE.test(lines[i])) {
      body.push(lines[i]);
      i++;
    }

    const speaker = body[0]?.match(/^([^:]+):\s*(.*)$/);
    cues.push(
      speaker
        ? {
            speaker: speaker[1].trim(),
            text: [speaker[2].trim(), ...body.slice(1)].join(" ").trim(),
            seconds,
          }
        : { speaker: "Unknown", text: body.join(" "), seconds },
    );
  }

  const turns: { speaker: string; text: string; seconds: number }[] = [];
  for (const cue of cues) {
    const last = turns[turns.length - 1];
    if (last && last.speaker === cue.speaker) {
      last.text = `${last.text} ${cue.text}`;
      last.seconds += cue.seconds;
    } else {
      turns.push({ ...cue });
    }
  }

  return turns.map((turn) => ({
    speaker: turn.speaker,
    text: turn.text,
    duration: Number(turn.seconds.toFixed(1)),
    wordCount: turn.text.split(/\s+/).filter(Boolean).length,
  }));
}

export function transcriptForPrompt(segments: Segment[]): string {
  return segments.map((s) => `${s.speaker}: ${s.text}`).join("\n");
}

// The share of the meeting the host spent talking, measured in seconds of speech.
export function talkListenRatio(segments: Segment[], hostName: string) {
  const host = hostName.trim().toLowerCase();
  const totalSeconds = segments.reduce((sum, s) => sum + s.duration, 0);
  const hostSeconds = segments
    .filter((s) => s.speaker.toLowerCase() === host)
    .reduce((sum, s) => sum + s.duration, 0);
  const percent = totalSeconds > 0 ? (hostSeconds / totalSeconds) * 100 : 0;
  return {
    hostSeconds: Math.round(hostSeconds),
    totalSeconds: Math.round(totalSeconds),
    percent: `${percent.toFixed(2)}%`,
  };
}

// The audio transcript's download link from Zoom's recordings response, or null when Zoom has none yet.
export function findTranscriptUrl(recordingsBody: string): string | null {
  const body = JSON.parse(recordingsBody) as {
    recording_files?: { recording_type?: string; download_url?: string }[];
  };
  const file = body.recording_files?.find(
    (f) => f.recording_type === "audio_transcript",
  );
  return file?.download_url ?? null;
}

// Zoom's start time as MM-DD-YY in UTC, read from the ISO string without building a Date.
export function formatMeetingDate(isoTime: string): string {
  const match = isoTime.match(/^(\d{4})-(\d{2})-(\d{2})/);
  return match ? `${match[2]}-${match[3]}-${match[1].slice(2)}` : "";
}

export function isOneOnOne(topic: string, titleText: string): boolean {
  return topic.toLowerCase().includes(titleText.trim().toLowerCase());
}
