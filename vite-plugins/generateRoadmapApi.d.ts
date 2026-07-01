import type { Plugin } from "vite";
/**
 * Dev/preview-server middleware that exposes `POST /api/generate-roadmap`.
 *
 * Generates a personalized, time-anchored roadmap for a student based on their
 * profile and Career Discovery Quiz results. The Anthropic API key is read here,
 * on the Node side, and is NEVER bundled into client code.
 */
export declare function generateRoadmapApi(apiKey: string | undefined): Plugin;
