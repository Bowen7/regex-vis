/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import path from "node:path"

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
    VERCEL_ANALYTICS_ID: JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
  },
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@ui": path.resolve(__dirname, "../../packages/ui/src"),
    },
  },
  test: {
    environment: "happy-dom",
  },
})
