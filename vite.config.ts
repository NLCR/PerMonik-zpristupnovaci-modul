/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'
import eslintPlugin from 'vite-plugin-eslint'
import { sentryVitePlugin } from '@sentry/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      svgr(),
      eslintPlugin(),
      sentryVitePlugin({
        url: env.VITE_SENTRY_URL,
        authToken: env.VITE_SENTRY_AUTH_TOKEN,
        org: env.VITE_SENTRY_ORG,
        project: env.VITE_SENTRY_PROJECT,
        release: {
          create: !!env.SENTRY_DEPLOY_ENV,
          deploy: {
            env: env.SENTRY_DEPLOY_ENV || 'Not specified',
          },
          setCommits: {
            auto: true,
            ignoreMissing: true,
          },
        },
        // telemetry: false,
        // debug: true,
      }),
    ],
    build: {
      // required for sentry: tells vite to create source maps
      sourcemap: true,
    },
    server: {
      port: 3000,
      host: true,
      proxy: {
        '/api': {
          target: 'http://localhost:8080/',
          changeOrigin: true,
          secure: false,
        },
      },
    },
  }
})
