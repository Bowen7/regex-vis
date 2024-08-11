/// <reference types="vitest" />
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import { ViteEjsPlugin } from 'vite-plugin-ejs'

export default defineConfig({
  base: '/',
  plugins: [react(), tsconfigPaths(), ViteEjsPlugin()],
  define: {
    // eslint-disable-next-line node/prefer-global/process
    SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
  },
  resolve: {
    alias: {
      'tailwind.config.js': path.resolve(__dirname, 'tailwind.config.js'),
    },
  },
  optimizeDeps: {
    include: [
      'tailwind.config.js',
    ],
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './tests/setup.ts',
  },
})
