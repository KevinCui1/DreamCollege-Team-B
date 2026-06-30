/**
 * Dev/preview-server middleware that exposes `POST /api/best-next-task`.
 *
 * The Anthropic API key is read here, on the Node side, and is NEVER bundled
 * into client code. Pass it in from `vite.config.ts` (via `loadEnv`). If it is
 * missing the endpoint responds with a clear error so the UI can prompt the
 * user to add their key — the rest of the app keeps working without it.
 */
export function bestNextTaskApi(apiKey) {
    const ROUTE = "/api/best-next-task";
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
            const result = await generateRecommendation(apiKey, context);
            return sendJson(res, 200, result);
        }
        catch (err) {
            const message = err instanceof Error ? err.message : "Unexpected server error.";
            return sendJson(res, 500, { error: message });
        }
    };
    return {
        name: "best-next-task-api",
        configureServer(server) {
            server.middlewares.use(handler);
        },
        configurePreviewServer(server) {
            server.middlewares.use(handler);
        },
    };
}
const SYSTEM_PROMPT = `You are a focused college and career advisor inside a student planning dashboard.

Your job: from the student context provided, recommend the SINGLE best next task the student should do right now.

Rules:
- Give exactly one task — the most actionable, realistic, student-specific next step. Avoid vague advice ("work hard", "explore options").
- Prefer a task the student can do with one of the app's existing tools/features listed under "availableTools". Do NOT invent unrelated tools or external tasks unless nothing in the app fits.
- Base the recommendation on the student's quiz answers, profile inputs, completed/incomplete activities, milestones, goals, and rank.
- Only after giving the best possible recommendation, list any missing information that would make a better recommendation. Never withhold a recommendation because information is missing.

Respond with the four fields: bestTask, why, appTool, missingInfo.`;
const RESPONSE_SCHEMA = {
    type: "object",
    properties: {
        bestTask: {
            type: "string",
            description: "The single best next task, phrased as a concrete action.",
        },
        why: {
            type: "string",
            description: "A short explanation of why this is the best next step.",
        },
        appTool: {
            type: "string",
            description: "The specific app tool/feature (by name) the student should use for this task.",
        },
        missingInfo: {
            type: "array",
            items: { type: "string" },
            description: "Information that would improve the recommendation. Empty array if none.",
        },
    },
    required: ["bestTask", "why", "appTool", "missingInfo"],
    additionalProperties: false,
};
async function generateRecommendation(apiKey, context) {
    // Dynamic import so a missing dependency doesn't crash the dev server at startup.
    const { default: Anthropic } = await import("@anthropic-ai/sdk");
    const client = new Anthropic({ apiKey });
    const userContent = `Here is the student's context as JSON:\n\n${JSON.stringify(context, null, 2)}\n\nRecommend the single best next task.`;
    const params = {
        model: "claude-opus-4-8",
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages: [{ role: "user", content: userContent }],
        // Structured outputs — the schema guarantees a clean JSON response. Typed
        // loosely (`as never`) so this stays robust across SDK versions.
        output_config: { format: { type: "json_schema", schema: RESPONSE_SCHEMA } },
    };
    const message = (await client.messages.create(params));
    const text = message.content
        .filter((b) => b.type === "text")
        .map((b) => b.text ?? "")
        .join("");
    return parseRecommendation(text);
}
function parseRecommendation(text) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch {
        // Fallback: pull the first {...} block out of the text.
        const match = text.match(/\{[\s\S]*\}/);
        if (!match)
            throw new Error("Model did not return a parseable response.");
        parsed = JSON.parse(match[0]);
    }
    return {
        bestTask: typeof parsed.bestTask === "string" ? parsed.bestTask : "",
        why: typeof parsed.why === "string" ? parsed.why : "",
        appTool: typeof parsed.appTool === "string" ? parsed.appTool : "",
        missingInfo: Array.isArray(parsed.missingInfo)
            ? parsed.missingInfo.filter((x) => typeof x === "string")
            : [],
    };
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
