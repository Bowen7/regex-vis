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
        find: "/components",
        replacement: fileURLToPath(
          new URL("./src/components", import.meta.url)
        ),
      },
      {
        find: "/parser",
        replacement: fileURLToPath(new URL("./src/parser", import.meta.url)),
      },
      {
        find: "/utils",
        replacement: fileURLToPath(new URL("./src/utils", import.meta.url)),
      },
      {
        find: "/modules",
        replacement: fileURLToPath(new URL("./src/modules", import.meta.url)),
      },
      {
        find: "/atom",
        replacement: fileURLToPath(new URL("./src/atom", import.meta.url)),
      },
      {
        find: "/constants",
        replacement: fileURLToPath(new URL("./src/constants", import.meta.url)),
      },
    ],
  },
})
