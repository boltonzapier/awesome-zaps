import { defineDurable } from "@zapier/zapier-durable";
import { createZapierSdk } from "@zapier/zapier-sdk";
import { z } from "zod";

import {
  CLIENT_NAME,
  CLIENT_TITLE,
  CLIENT_COMPANY,
  PROCESSED_FOLDER_ID,
  FEEDBACK_DOC_ID,
  AI_MODEL,
} from "./config.ts";

const sdk = createZapierSdk();

// The new Drive file as the trigger delivers it. Google Meet saves a transcript doc and a notes doc per meeting.
const InputSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    createdDate: z.string(),
  })
  .loose();

// Divides each new analysis from the one before it in the feedback doc.
const SEPARATOR = "______________________________________";

const meetingDate = (createdDate: string) =>
  new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "2-digit",
  }).format(new Date(createdDate));

// The model must return only the ANALYSIS_BLOCK, because the feedback doc is appended verbatim.
const coachingInstructions = (
  meetingName: string,
  date: string,
) => `[Persona & Prime Directive]
You are a world-class Catalytic Leadership Coach. Your client is ${CLIENT_NAME}, the ${CLIENT_TITLE} at ${CLIENT_COMPANY}. You focus on them only. Your prime directive is to analyze the provided transcript and output your findings ONLY in the structured format defined below.

[Primary Objective: The Output Format]
CRITICAL: Your ONLY output must be the populated ANALYSIS_BLOCK template below. Do not write a summary, an introduction, or any conversational text. Your response must begin with --- and end with ANALYSIS_BLOCK_END. Adhere strictly to the line breaks and indentation shown in the template.

---
ANALYSIS_BLOCK_START
DATE: ${date}
MEETING NAME: ${meetingName}
STRENGTHS_ANALYSIS:
- BEHAVIOR: [Describe the specific strength observed.]
  CONTEXT: [Explain the context of the conversation when this happened.]
  EVIDENCE:
  - "[Insert a direct, verbatim quote that demonstrates this strength.]"
GROWTH_ANALYSIS:
- BEHAVIOR: [Describe the specific growth opportunity.]
  CONTEXT: [Explain the context.]
  EVIDENCE:
  - "[Insert a direct, verbatim quote that shows this behavior.]"
CATALYTIC_ANALYSIS:
- SAY_DO_GAP: [Note any observed incongruence between words and actions/tone.]
- DECISION_MAKING: [Analyze a key decision's impact and conviction level.]
- BLINDSPOT_QUESTION: [Pose a question about how your personal communication style is perceived, e.g., "How might your pace of speaking affect the team's willingness to interject with their own ideas?"]
- LANGUAGE_PATTERNS:
  - PRONOUN_USAGE: [Analyze I vs. We vs. You usage.]
  - METAPHOR_TYPE: [Analyze the core metaphor (e.g., War vs. Exploration).]
  - ACTION_ORIENTATION: [Analyze the language of action vs. theory.]
- ENERGY_LEVEL: [Assess energy and resilience.]
MINDSET_ANALYSIS:
- MINDSET: [Name the relevant leadership mindset or framework from your organization.]
  ANALYSIS: [Provide a brief, evidence-based, analysis.]
PER_MEETING_RECOMMENDATIONS:
- START: [Purely behavioral advice, e.g., "Start asking 'what are your thoughts on this?' after sharing an idea to invite collaboration."]
- STOP: [Purely behavioral advice, e.g., "Stop using definitive statements like 'the only way is...' to allow for alternative views."]
- CONTINUE: [Purely behavioral advice, e.g., "Continue holding a calm and steady tone during tense discussions, as it fosters psychological safety."]
ANALYSIS_BLOCK_END

[Analytical Framework]
Populate the template above using the Diagnostic Framework below.

Guiding philosophy:
- Pillar 1: Radical Candor, Unyielding Empathy. Be brutally honest but supportive.
- Pillar 2: Systems Thinking. Analyze how communication impacts the entire ecosystem.
- Pillar 3: Vision to Execution Velocity. Scrutinize the language of action vs. theory for momentum.

Core analytical task:
1. Read the entire meeting transcript.
2. Focus on the client, since they are the subject of study.
3. Filter the transcript through the Diagnostic Framework:
   a. Strengths and Growth: identify the most significant strengths and growth opportunities.
   b. Say-Do Gap Analysis: identify contradictions between words, tone, and action.
   c. Decision-Making Matrix: analyze a key decision's impact and conviction level.
   d. Language and Metaphor Index: analyze pronoun usage, metaphors, and action-orientation.
   e. Energy and Resilience Meter: assess vocal energy and linguistic patterns.
   f. Blind spot: formulate a powerful question about the client's interpersonal impact.
4. Formulate a concrete Start, Stop, Continue recommendation framed as direct, actionable advice from a coach.
5. Connect observations to the organization's leadership principles where applicable.
6. Use your findings to populate the ANALYSIS_BLOCK template in the Primary Objective section.`;

const workflow = defineDurable(
  "analyze-google-meet-transcripts-into-leadership-feedback",
  async (ctx, rawInput) => {
    const input = InputSchema.parse(
      typeof rawInput === "string" ? JSON.parse(rawInput) : rawInput,
    );

    // Meeting docs only: other files that land in the folder are ignored.
    const isTranscript = /transcript/i.test(input.title);
    if (!isTranscript && !/notes/i.test(input.title)) {
      return { skipped: true, reason: "not-a-meeting-doc", id: input.id };
    }

    await ctx.step(`move-to-processed-${input.id}`, async () =>
      sdk.runAction({
        appKey: "google-drive",
        actionType: "write",
        actionKey: "move_file",
        connection: "google-drive",
        inputs: { file: input.id, folder: PROCESSED_FOLDER_ID },
      }),
    );

    const document = await ctx.step(`read-document-${input.id}`, async () => {
      const result = await sdk.runAction({
        appKey: "google-docs",
        actionType: "search",
        actionKey: "get_document_content",
        connection: "google-docs",
        inputs: { document_id: input.id },
      });
      const row = result.data[0] as { text_content?: unknown } | undefined;
      return String(row?.text_content ?? "");
    });

    // A notes doc carries its transcript after a "Transcript" heading; only that part is analyzed.
    const text = isTranscript
      ? document
      : (document.split("Transcript").at(-1) ?? "");
    if (!text.trim()) {
      return { skipped: true, reason: "empty-document", id: input.id };
    }

    const analysis = await ctx.step(`analyze-meeting-${input.id}`, async () => {
      const result = await sdk.runAction({
        appKey: "ai",
        actionType: "write",
        actionKey: "get_completion",
        connection: "ai",
        inputs: {
          model_id: AI_MODEL,
          authentication_id: "0",
          includeWorkflowData: false,
          instructions: coachingInstructions(
            input.title,
            meetingDate(input.createdDate),
          ),
          inputFields: { "Call transcript": text },
          outputFields: [],
        },
      });
      const row = result.data[0] as { output?: unknown } | undefined;
      return String(row?.output ?? "");
    });

    await ctx.step(`append-feedback-${input.id}`, async () =>
      sdk.runAction({
        appKey: "google-docs",
        actionType: "write",
        actionKey: "append",
        connection: "google-docs",
        inputs: {
          file: FEEDBACK_DOC_ID,
          text: `${SEPARATOR}\n${analysis}`,
        },
      }),
    );

    return { id: input.id, title: input.title };
  },
);

export default workflow;
