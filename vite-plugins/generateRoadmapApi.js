/**
 * Dev/preview-server middleware that exposes `POST /api/generate-roadmap`.
 *
 * Generates a personalized, time-anchored roadmap for a student based on their
 * profile and Career Discovery Quiz results, plus a single "best next step"
 * recommendation (merged in from the old Best Next Task feature). The
 * Anthropic API key is read here, on the Node side, and is NEVER bundled
 * into client code.
 */
export function generateRoadmapApi(apiKey) {
    const ROUTE = "/api/generate-roadmap";
    const handler = async (req, res, next) => {
        if (req.url !== ROUTE)
            return next();
        if (req.method !== "POST") {
            return sendJson(res, 405, { error: "Method not allowed." });
        }
        if (!apiKey) {
            return sendJson(res, 500, {
                error: "ANTHROPIC_API_KEY not configured. Copy .env.example to .env.local, add your key, then restart the dev server.",
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
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Unexpected server error.";
            return sendJson(res, 500, { error: message });
        }
    };
    return {
        name: "generate-roadmap-api",
        configureServer(server) {
            server.middlewares.use(handler);
        },
        configurePreviewServer(server) {
            server.middlewares.use(handler);
        },
    };
}
const SYSTEM_PROMPT = `You are a college and career planning advisor creating a personalized future roadmap for a high school student.

Using the student's profile, career quiz results, completed activities, and (if present) the activity they most recently completed, generate:

1. A focused roadmap of 5–8 concrete, time-anchored milestones ("entries").
2. A single "recommendation": the one best next action for the student to take right now, given everything they've done so far.

Rules for entries:
- Every entry must be specific and actionable, not generic. "Do well in school" is useless. "Enroll in AP Chemistry to strengthen your pre-med path" is useful.
- Use the student's current grade level as the time anchor. Spread entries from near-term through senior spring.
- Focus on real-world actions outside the app: campus visits, test prep timelines, internship or shadowing searches, extracurricular leadership, scholarship applications, etc.
- Tailor every entry directly to the student's quiz answers, interests, goals, and constraints. Name specific resources or opportunities where possible.
- Do not repeat the standard app activities (taking the career quiz, building a shortlist, submitting applications). Add supplementary real-world steps that complement those.
- Keep entry titles short (under 8 words) and descriptions to 1–2 sentences.
- Category must be exactly one of: career, academic, college, application, financial, personal.

Rules for the recommendation:
- If "lastCompletedActivity" is present, treat it as the freshest signal — the recommendation should account for what just changed, not just repeat a generic next step.
- "bestTask" is one specific, immediately actionable task (not a whole phase).
- "why" briefly explains why this is the right task right now, given their profile and progress.
- "appTool" names the specific in-app tool or activity (from "incompleteActivities" if relevant) that helps them do it, or empty string if none applies.
- "missingInfo" lists 0–3 short pieces of info that would sharpen the recommendation further (e.g. "Which colleges are you most interested in?"). Empty array if nothing is missing.

Respond with a JSON object containing "entries" and "recommendation".`;
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
            description: "When to do this, e.g. 'This summer', 'Junior fall', 'Senior spring'.",
        },
        category: {
            type: "string",
            enum: ["career", "academic", "college", "application", "financial", "personal"],
        },
    },
    required: ["id", "title", "description", "timeframe", "category"],
    additionalProperties: false,
};
const RECOMMENDATION_SCHEMA = {
    type: "object",
    properties: {
        bestTask: {
            type: "string",
            description: "One specific, immediately actionable next task.",
        },
        why: {
            type: "string",
            description: "1–2 sentences on why this is the right task right now.",
        },
        appTool: {
            type: "string",
            description: "Specific in-app tool/activity that helps, or empty string.",
        },
        missingInfo: {
            type: "array",
            items: { type: "string" },
            description: "0-3 short questions that would sharpen the recommendation.",
        },
    },
    required: ["bestTask", "why", "appTool", "missingInfo"],
    additionalProperties: false,
};
const RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        entries: { type: "array", items: ENTRY_SCHEMA },
        recommendation: RECOMMENDATION_SCHEMA,
    },
    required: ["entries", "recommendation"],
    additionalProperties: false,
};
async function generateRoadmap(apiKey, context) {
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    const userContent = `Here is the student's context:\n\n${JSON.stringify(context, null, 2)}\n\nGenerate their personalized future roadmap and their single best next step.`;
    const params = {
        model: "claude-opus-4-8",
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
        output_config: { format: { type: "json_schema", schema: RESPONSE_SCHEMA } },
    };
    const message = (await client.messages.create(params));
    const text = message.content
        .filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("");
    return parseRoadmap(text);
}
function parseRoadmap(text) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch {
        const match = text.match(/\{[\s\S]*\}/);
        if (!match)
            throw new Error("Model did not return a parseable response.");
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
        .filter((e) => !!e && typeof e === "object")
        .map((e, i) => ({
        id: typeof e.id === "string" && e.id ? e.id : `entry-${i}`,
        title: typeof e.title === "string" ? e.title : "",
        description: typeof e.description === "string" ? e.description : "",
        timeframe: typeof e.timeframe === "string" ? e.timeframe : "",
        category: VALID_CATEGORIES.includes(e.category)
            ? e.category
            : "personal",
    }))
        .filter((e) => e.title);
    const rawRecommendation = parsed.recommendation && typeof parsed.recommendation === "object"
        ? parsed.recommendation
        : null;
    const recommendation = rawRecommendation && typeof rawRecommendation.bestTask === "string" && rawRecommendation.bestTask
        ? {
            bestTask: rawRecommendation.bestTask,
            why: typeof rawRecommendation.why === "string" ? rawRecommendation.why : "",
            appTool: typeof rawRecommendation.appTool === "string" ? rawRecommendation.appTool : "",
            missingInfo: Array.isArray(rawRecommendation.missingInfo)
                ? rawRecommendation.missingInfo.filter((m) => typeof m === "string")
                : [],
        }
        : undefined;
    return { entries, recommendation };
}
function readBody(req) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        req.on("data", (chunk) => chunks.push(chunk));
        req.on("end", () => {
            const raw = Buffer.concat(chunks).toString("utf8");
            if (!raw)
                return resolve(null);
            try {
                resolve(JSON.parse(raw));
            }
            catch {
                reject(new Error("Request body was not valid JSON."));
            }
        });
        req.on("error", reject);
    });
}
function sendJson(res, status, payload) {
    res.statusCode = status;
    res.setHeader("Content-Type", "application/json");
    res.end(JSON.stringify(payload));
}
