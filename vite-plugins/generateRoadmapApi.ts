import type { Connect, Plugin, ViteDevServer, PreviewServer } from "vite";
import type { ServerResponse } from "node:http";

/**
 * Dev/preview-server middleware that exposes `POST /api/generate-roadmap`.
 *
 * Generates a personalized, time-anchored roadmap for a student based on their
 * profile and Career Discovery Quiz results. The Gemini API key is read here,
 * on the Node side, and is NEVER bundled into client code.
 */
export function generateRoadmapApi(apiKey: string | undefined): Plugin {
  const ROUTE = "/api/generate-roadmap";

  const handler = async (
    req: Connect.IncomingMessage,
    res: ServerResponse,
    next: Connect.NextFunction,
  ) => {
    if (req.url !== ROUTE) return next();
    if (req.method !== "POST") {
      return sendJson(res, 405, { error: "Method not allowed." });
    }

    if (!apiKey) {
      return sendJson(res, 500, {
        error:
          "GEMINI_API_KEY not configured. Copy .env.example to .env.local, add your key, then restart the dev server.",
      });
    }

    try {
      const body = await readBody(req);
      const context = body?.context;
      if (!context) {
        return sendJson(res, 400, { error: "Missing student context." });
      }

      const result = await generateRoadmap(apiKey, context);
      return sendJson(res, 200, result);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected server error.";
      return sendJson(res, 500, { error: message });
    }
  };

  return {
    name: "generate-roadmap-api",
    configureServer(server: ViteDevServer) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(handler);
    },
  };
}

const SYSTEM_PROMPT = `You are a college and career planning advisor inside a student planning app called Dream College. You produce three things for one high school student, based on their profile (grade level, GPA, AP count, standardized test scores, activities, awards), their Career Discovery Quiz answers, and which app sections they've completed:

1. "recommendation" — the SINGLE best next section of the app the student should go to right now, and why.
2. "sectionPicks" — 2 to 4 more sections worth visiting next, ranked, each with its own reason. These are outlined beneath the top pick and must not repeat the recommendation.
3. "entries" — a 5–8 step real-world future roadmap (actions outside the app).

## Routing to sections (recommendation + sectionPicks)

The student context includes "availableSections": an array of app sections, each with an "id", a "purpose" describing what it's for, and a "done" flag. This is the ONLY menu you may route to.

Hard rules:
- Every "sectionId" you output MUST be an exact "id" copied from availableSections. Never invent an id or route anywhere not in that list.
- Strongly prefer sections where done is false. Only route to a done section if the student's newest completed step clearly calls for revisiting it.
- The "recommendation.why" and each "sectionPicks[].why" MUST cite the student's SPECIFIC signals — their actual grade, GPA, the actual activities and awards they listed, and their actual quiz answers. Never give generic advice ("explore your options"), and never pick a section that doesn't genuinely follow from their data. If two students have different profiles, they should get different recommendations.

Reasoning examples (illustrative, NOT an exhaustive or fixed mapping — reason from THIS student's data):
- The student has few or thin activities → route to "activities" to build the list out.
- The student's activities all cluster in one subject or theme → route to "positioning-statement" to frame them into a spike/narrative, or "explore-all-careers" to see where that theme leads.
- The student's quiz answers imply a career that lines up with their awards or activities → route to "career-fit-report" to validate and deepen that fit.
- The student is in an early grade (9th/10th) → route to "high-school-plan" to map out the four years.
- The student has strong stats but no target schools or major yet → route to "colleges", "majors", or "shortlist".
- The College Profile itself is empty/incomplete → route to "college-profile" first so everything else can be personalized.
Many other valid reasons exist; whatever you pick, explain the reasoning explicitly from the student's data.

## The real-world roadmap (entries)

- Generate 5–8 concrete, time-anchored milestones for actions OUTSIDE the app: campus visits, test prep timelines, internship or shadowing searches, extracurricular leadership, scholarship applications, etc.
- Every entry must be specific and actionable, not generic. "Do well in school" is useless. "Enroll in AP Chemistry to strengthen your pre-med path" is useful.
- Use the student's current grade level as the time anchor. Spread entries from near-term through senior spring.
- Tailor every entry to the student's quiz answers, profile, and constraints. Name specific resources or opportunities where possible.
- Do not repeat the standard app activities or the sections you routed to above. Keep titles under 8 words and descriptions to 1–2 sentences.
- Category must be exactly one of: career, academic, college, application, financial, personal.

Respond with a JSON object containing "recommendation", "sectionPicks", and "entries".`;

const ENTRY_SCHEMA = {
  type: "object",
  properties: {
    id: { type: "string", description: "Unique kebab-case slug." },
    title: { type: "string", description: "Short action title, max 8 words." },
    description: {
      type: "string",
      description: "1–2 sentences of specific, student-tailored guidance.",
    },
    timeframe: {
      type: "string",
      description:
        "When to do this, e.g. 'This summer', 'Junior fall', 'Senior spring'.",
    },
    category: {
      type: "string",
      enum: ["career", "academic", "college", "application", "financial", "personal"],
    },
  },
  required: ["id", "title", "description", "timeframe", "category"],
  additionalProperties: false,
} as const;

const RECOMMENDATION_SCHEMA = {
  type: "object",
  properties: {
    bestTask: {
      type: "string",
      description: "The single best next action, phrased as a short imperative.",
    },
    why: {
      type: "string",
      description:
        "1–2 sentences citing the student's specific grade, stats, activities, awards, or quiz answers that make this the best next step.",
    },
    sectionId: {
      type: "string",
      description:
        "The exact `id` of the section to route to, copied from availableSections.",
    },
    missingInfo: {
      type: "array",
      items: { type: "string" },
      description:
        "Any information that would sharpen the recommendation. Empty array if none.",
    },
  },
  required: ["bestTask", "why", "sectionId", "missingInfo"],
  additionalProperties: false,
} as const;

const SECTION_PICK_SCHEMA = {
  type: "object",
  properties: {
    sectionId: {
      type: "string",
      description:
        "The exact `id` of another section to visit, copied from availableSections.",
    },
    why: {
      type: "string",
      description:
        "One sentence citing the student's specific data for why this section is worth visiting.",
    },
  },
  required: ["sectionId", "why"],
  additionalProperties: false,
} as const;

const RESPONSE_SCHEMA = {
  type: "object",
  properties: {
    recommendation: RECOMMENDATION_SCHEMA,
    sectionPicks: { type: "array", items: SECTION_PICK_SCHEMA },
    entries: { type: "array", items: ENTRY_SCHEMA },
  },
  required: ["recommendation", "sectionPicks", "entries"],
  additionalProperties: false,
} as const;

async function generateRoadmap(apiKey: string, context: unknown) {
  const { GoogleGenAI } = await import("@google/genai");
  const client = new GoogleGenAI({ apiKey });

  const userContent = `Here is the student's context:\n\n${JSON.stringify(
    context,
    null,
    2,
  )}\n\nGenerate their personalized future roadmap.`;

  const response = await client.models.generateContent({
    model: "gemini-2.5-flash",
    contents: userContent,
    config: {
      systemInstruction: SYSTEM_PROMPT,
      responseMimeType: "application/json",
      responseSchema: RESPONSE_SCHEMA,
    },
  });

  return parseRoadmap(response.text ?? "", validSectionIds(context));
}

/** The section ids the model is allowed to route to, taken from the context we sent. */
function validSectionIds(context: unknown): Set<string> {
  const sections = (context as { availableSections?: unknown })
    ?.availableSections;
  if (!Array.isArray(sections)) return new Set();
  return new Set(
    sections
      .map((s) => (s as { id?: unknown })?.id)
      .filter((id): id is string => typeof id === "string" && id.length > 0),
  );
}

function parseRoadmap(text: string, sectionIds: Set<string>) {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model did not return a parseable response.");
    parsed = JSON.parse(match[0]);
  }

  const VALID_CATEGORIES = [
    "career",
    "academic",
    "college",
    "application",
    "financial",
    "personal",
  ];

  const rawEntries = Array.isArray(parsed.entries) ? parsed.entries : [];
  const entries = rawEntries
    .filter((e): e is Record<string, unknown> => !!e && typeof e === "object")
    .map((e, i) => ({
      id: typeof e.id === "string" && e.id ? e.id : `entry-${i}`,
      title: typeof e.title === "string" ? e.title : "",
      description: typeof e.description === "string" ? e.description : "",
      timeframe: typeof e.timeframe === "string" ? e.timeframe : "",
      category: VALID_CATEGORIES.includes(e.category as string)
        ? (e.category as string)
        : "personal",
    }))
    .filter((e) => e.title);

  // Only surface a recommendation whose sectionId is a real, known route so the
  // UI never renders a dead link to a hallucinated section.
  const rec = parsed.recommendation as Record<string, unknown> | undefined;
  const recSectionId =
    rec && typeof rec.sectionId === "string" ? rec.sectionId : "";
  const recommendation =
    rec && typeof rec.bestTask === "string" && sectionIds.has(recSectionId)
      ? {
          bestTask: rec.bestTask,
          why: typeof rec.why === "string" ? rec.why : "",
          sectionId: recSectionId,
          missingInfo: Array.isArray(rec.missingInfo)
            ? rec.missingInfo.filter(
                (m): m is string => typeof m === "string",
              )
            : [],
        }
      : undefined;

  const rawPicks = Array.isArray(parsed.sectionPicks)
    ? parsed.sectionPicks
    : [];
  const sectionPicks = rawPicks
    .filter((p): p is Record<string, unknown> => !!p && typeof p === "object")
    .map((p) => ({
      sectionId: typeof p.sectionId === "string" ? p.sectionId : "",
      why: typeof p.why === "string" ? p.why : "",
    }))
    .filter(
      (p) => sectionIds.has(p.sectionId) && p.sectionId !== recSectionId,
    );

  return { recommendation, sectionPicks, entries };
}

function readBody(
  req: Connect.IncomingMessage,
): Promise<{ context?: unknown } | null> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    req.on("data", (chunk: Buffer) => chunks.push(chunk));
    req.on("end", () => {
      const raw = Buffer.concat(chunks).toString("utf8");
      if (!raw) return resolve(null);
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Request body was not valid JSON."));
      }
    });
    req.on("error", reject);
  });
}

function sendJson(res: ServerResponse, status: number, payload: unknown) {
  res.statusCode = status;
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(payload));
}
