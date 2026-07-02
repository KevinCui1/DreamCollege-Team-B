import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import { generateRoadmapApi } from "./vite-plugins/generateRoadmapApi";

export default defineConfig(({ mode }) => {
  // Load every env var (empty prefix) for server-side use only. ANTHROPIC_API_KEY
  // is read here in the Node process and is never exposed to client code.
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [
      react(),
      generateRoadmapApi(env.ANTHROPIC_API_KEY),
    ],
  };
});
