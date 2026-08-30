const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

function getConfig() {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw Object.assign(new Error("OPENROUTER_API_KEY is not configured."), { status: 503 });
  }

  return {
    apiKey,
    model: process.env.OPENROUTER_MODEL || "~openai/gpt-latest"
  };
}

// Hard ceiling based on the account's actual available credits.
// OpenRouter has reported it can only afford ~921 completion tokens per
// request right now — asking for more just fails outright with a credits
// error. Keep a safety margin under that ceiling rather than doubling on
// retry, since more credits are not available.
const DEFAULT_MAX_TOKENS = Number(process.env.OPENROUTER_MAX_TOKENS) || 800;
const MAX_AFFORDABLE_TOKENS = Number(process.env.OPENROUTER_MAX_AFFORDABLE_TOKENS) || 900;

async function callOpenRouterOnce(messages, { json = false, maxTokens = DEFAULT_MAX_TOKENS } = {}) {
  const { apiKey, model } = getConfig();

  const response = await fetch(OPENROUTER_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      ...(process.env.CLIENT_URL ? { "HTTP-Referer": process.env.CLIENT_URL } : {}),
      "X-OpenRouter-Title": "LearnPath AI"
    },
    body: JSON.stringify({
      model,
      messages,
      max_tokens: maxTokens,
      ...(json ? {
        response_format: {
          type: "json_object"
        }
      } : {})
    })
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = body?.error?.message || `OpenRouter request failed with HTTP ${response.status}.`;
    const error = new Error(message);
    error.status = response.status >= 500 ? 503 : response.status;
    throw error;
  }

  const choice = body?.choices?.[0];
  const text = choice?.message?.content;

  // Usage/cost logging so real token consumption is visible per call,
  // instead of guessing from truncation errors.
  const usage = body?.usage;
  if (usage) {
    console.log(
      `[OpenRouter usage] model=${body.model || model} ` +
      `prompt=${usage.prompt_tokens} completion=${usage.completion_tokens} ` +
      `total=${usage.total_tokens} cost=$${usage.cost ?? "?"} ` +
      `finish_reason=${choice?.finish_reason}`
    );
  }

  if (!text) {
    throw Object.assign(new Error("OpenRouter returned an empty response."), { status: 502 });
  }

  return { text, finishReason: choice?.finish_reason };
}

// Wraps callOpenRouterOnce, clamping max_tokens to what the account can
// actually afford. If output still gets cut off at that ceiling, this
// throws a clear "truncated" error instead of a confusing "invalid JSON"
// failure downstream — there is no retry, since retrying with more
// tokens is not affordable and will just hit the credits error again.
async function callOpenRouter(messages, { json = false, maxTokens = DEFAULT_MAX_TOKENS } = {}) {
  // Never request more than what credits can afford — retrying bigger
  // just fails again with the same "insufficient credits" error.
  const cappedTokens = Math.min(maxTokens, MAX_AFFORDABLE_TOKENS);

  const result = await callOpenRouterOnce(messages, { json, maxTokens: cappedTokens });

  if (result.finishReason === "length") {
    throw Object.assign(
      new Error(
        `OpenRouter response was truncated at max_tokens=${cappedTokens} (your account's affordable limit). ` +
        `Shorten the request or reduce the response schema.`
      ),
      { status: 502 }
    );
  }

  return result.text;
}

function parseJson(text) {
  try {
    return JSON.parse(text);
  } catch {
    const cleaned = text
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();

    try {
      return JSON.parse(cleaned);
    } catch {
      throw Object.assign(new Error("AI returned invalid JSON for the learning path."), { status: 502 });
    }
  }
}

// Kept intentionally small (1 phase, 2 topics, 1 task each, no
// recommendations array) so the full JSON reliably fits under the
// account's affordable token ceiling (~900 completion tokens).
const roadmapSchemaDescription = `{
  "title": "string",
  "description": "string (max 15 words)",
  "totalDays": 30,
  "skillGaps": [
    {
      "skill": "string",
      "currentLevel": "beginner|intermediate|advanced",
      "targetLevel": "beginner|intermediate|advanced",
      "reason": "string (max 10 words)"
    }
  ],
  "phases": [
    {
      "title": "string",
      "description": "string (max 15 words)",
      "durationDays": 7,
      "order": 1,
      "topics": [
        {
          "title": "string",
          "description": "string (max 10 words)",
          "estimatedHours": 4,
          "priority": "high|medium|low",
          "tasks": [
            {
              "title": "string",
              "description": "string (max 10 words)",
              "estimatedHours": 2,
              "priority": "high|medium|low",
              "status": "pending",
              "dueDay": 2,
              "resourceType": "course|article|video|documentation|project|practice",
              "resourceUrl": ""
            }
          ]
        }
      ]
    }
  ],
  "milestones": [
    {
      "title": "string",
      "day": 7,
      "description": "string (max 10 words)"
    }
  ]
}`;

export async function generateLearningPath({ goal, profile }) {
  const prompt = `You are the planning engine for LearnPath AI.
Create a realistic personalized learning path. Do not assume the learner is a complete beginner if their profile says otherwise.

Goal: ${JSON.stringify(goal)}
Learner profile: ${JSON.stringify(profile)}

Rules:
- Your output token budget is very limited. Be extremely concise.
- Return EXACTLY 1 phase, with EXACTLY 2 topics, each with EXACTLY 1 task.
- Include exactly 2 skillGaps and exactly 1 milestone.
- Do not include a "recommendations" field at all.
- Never invent resource URLs. Always use "" for resourceUrl.
- Follow every word-count limit in the schema strictly.
- Return ONLY valid JSON matching this structure, with no markdown fences and nothing before or after it:
${roadmapSchemaDescription}`;

  const text = await callOpenRouter(
    [{ role: "user", content: prompt }],
    { json: true, maxTokens: MAX_AFFORDABLE_TOKENS }
  );
  return parseJson(text);
}

export async function chatWithLearner({ message, roadmap, profile }) {
  const prompt = `You are the AI learning assistant inside LearnPath AI.
Answer the learner clearly and practically. Keep the answer concise (a few short paragraphs at most).

Learner profile: ${JSON.stringify(profile)}
Current roadmap: ${JSON.stringify(roadmap)}
Learner question: ${message}`;

  return callOpenRouter([{ role: "user", content: prompt }], { maxTokens: DEFAULT_MAX_TOKENS });
}

export async function analyzeProgress({ roadmap, profile }) {
  const prompt = `Analyze this learner's progress and return concise advice.
Profile: ${JSON.stringify(profile)}
Roadmap: ${JSON.stringify(roadmap)}
Calculate approximate completion from task statuses if possible.
Mention risks, next actions, and one practical recommendation. Be brief.`;

  return callOpenRouter([{ role: "user", content: prompt }], { maxTokens: DEFAULT_MAX_TOKENS });
}

export async function reschedulePath({ roadmap, profile, missedDays }) {
  const prompt = `The learner missed ${missedDays} days.
Propose a revised schedule without destroying completed work.
Roadmap: ${JSON.stringify(roadmap)}
Profile: ${JSON.stringify(profile)}
Return a concise proposal with: what moves, what stays, optional topics to drop, and expected new workload. Be brief.`;

  return callOpenRouter([{ role: "user", content: prompt }], { maxTokens: DEFAULT_MAX_TOKENS });
}