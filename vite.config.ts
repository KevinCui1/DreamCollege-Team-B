import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { bestNextTaskApi } from "./vite-plugins/bestNextTaskApi";

export default defineConfig(({ mode }) => {
  // Load every env var (empty prefix) for server-side use only. ANTHROPIC_API_KEY
  // is read here in the Node process and is never exposed to client code.
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [react(), bestNextTaskApi(env.ANTHROPIC_API_KEY)],
  };
});
