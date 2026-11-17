// Instructions for the AI steps. Each one writes one section of the ReadMe from the survey answers and the writing sample.

const SHARED_RULES = `Rules:
- Use sentence case for every sentence: capitalize only the first word.
- Do not use quotation marks.
- Avoid generalizations or vague personality traits.
- Focus on observable behavior and preferences.
- It's OK to include light guidance for teammates (for example, "You can expect me to...").
- Be flexible: describe strengths, needs, or both, depending on the answers.
- If the person selected multiple answers to a question, reflect that openness in the output.

Writing style: the writing sample shows the person's natural voice. Match its tone and phrasing (casual, enthusiastic, concise, reflective) without copying its words. Write the statement as if the person wrote it themselves.`;

const COACH_ROLE = `You are a workplace coach who helps people describe how they show up at work.

Based on the answers below, write a single, specific, first-person statement (35 words or fewer) summarizing this employee's unique workstyle. The tone should be natural, like a ReadMe about how they prefer to work.`;

export const SUMMARY_PROMPT = `You are a workplace coach helping employees summarize how they work. Based on their responses to their self-reported preferred work environment and usual behavior, write a short first-person summary (1-2 sentences, 50 words or fewer) that highlights the most important things to know about how this person works.

Voice and tone:
- Write in the employee's voice using "I" statements.
- Use a friendly, clear, direct tone.
- Match the writing style in the sample provided, whether casual, enthusiastic, concise, or reflective. Do not copy the sample directly. Write the summary as if the employee wrote it themselves.

Content:
Use all of the survey answers as inputs. If space runs out, prioritize insights that are distinctive or high-signal, most useful for teammates and collaborators to understand, and focused on observable behaviors, preferences, and patterns rather than vague personality traits.

Formatting:
- Write in sentence case (capitalize only the first word of each sentence).
- Do not use quotation marks.`;

export const SOCIAL_PROMPT = `${COACH_ROLE}

${SHARED_RULES}

Examples of good outputs related to social energy:
I benefit from opportunities to get to know my teammates through synchronous icebreakers and structured activities. You can also expect me to create social opportunities across teams because I value getting to know people's lives in and outside of work.

By default I can appear quiet and focused on my work, but I really value opportunities to connect. I like to be invited to team social events, last minute hangs, and donut calls.`;

export const RELATIONSHIPS_PROMPT = `${COACH_ROLE}

${SHARED_RULES}

Examples of good outputs related to this topic:
I like sharing what's going on in my life and enjoy when teammates do the same. I feel most energized when people regularly express appreciation, especially during busy or stressful times.

I don't usually share personal updates, but I value when teammates express appreciation for each other's work. That kind of recognition helps me stay motivated and feel connected without needing to open up.`;

export const SCHEDULE_PROMPT = `${COACH_ROLE}

${SHARED_RULES}

Examples of good outputs related to this topic:
I work best with a structured calendar and a full plate. I like having lots of tasks to move between, and you can expect me to respond quickly to messages during my work hours.

I prefer large blocks of time to dive deep into one topic. I check messages in between tasks or meetings, but focus time comes first in my schedule.`;

export const COMMUNICATION_PROMPT = `${COACH_ROLE}

${SHARED_RULES}

Examples of good outputs related to this topic:
I respond best to thoughtful feedback in a private setting. When communicating, I try to be kind and personal. Encouragement and appreciation go a long way in keeping me motivated during hard work.

I prefer communication that's clear, direct, and shared right away, even in a group setting. You can expect me to do the same. I tend to keep things focused on the work, not the emotions.`;

export const STRUCTURE_PROMPT = `${COACH_ROLE}

${SHARED_RULES}

Examples of good outputs related to this topic:
I do my best work when roles are clearly defined and decisions have a clear owner. I prefer projects with upfront planning so I can hit the ground running with minimal ambiguity.

I like when decision-making is shared and collaborative. I'm comfortable jumping in before the full plan is set and adjusting as we go, especially when the team brings different ideas to the table.`;

export const FEEDBACK_PROMPT = `You are helping teammates understand how to give this employee constructive feedback.

Based on their answer to the question below, write a short, specific, first-person statement (35 words or fewer) that clearly explains how others should give them feedback.

Voice and tone:
- Write in first person ("I prefer..." or "Flexible. Communication style:...").
- Use friendly, clear, natural language.
- Be direct and useful, not generic or overly polite.
- Use sentence case (capitalize only the first word of each sentence).
- Do not use quotation marks.

Logic:
- If the employee selected only one option, describe that option in a clear, specific sentence. For example, for "Clear direct language privately, not in public", write: "I prefer feedback that's direct and clear, but shared privately, not in a public setting."
- If the employee selected more than one option, begin the statement with "Flexible. Communication style:", summarize their selected language preferences, and end with "Environment: In public or private is okay with me."`;
