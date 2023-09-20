/// <reference types="vitest" />
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react-swc"
import { fileURLToPath, URL } from "url"

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
    VERCEL_ANALYTICS_ID: JSON.stringify(process.env.VERCEL_ANALYTICS_ID),
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  test: {
    environment: "happy-dom",
  },
})
