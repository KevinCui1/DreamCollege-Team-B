import type { Plugin } from "vite";
/**
 * Dev/preview-server middleware that exposes `POST /api/best-next-task`.
 *
 * The Anthropic API key is read here, on the Node side, and is NEVER bundled
 * into client code. Pass it in from `vite.config.ts` (via `loadEnv`). If it is
 * missing the endpoint responds with a clear error so the UI can prompt the
 * user to add their key — the rest of the app keeps working without it.
 */
export declare function bestNextTaskApi(apiKey: string | undefined): Plugin;
