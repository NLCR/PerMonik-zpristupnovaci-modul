/// <reference types="vite/client" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import eslintPlugin from 'vite-plugin-eslint'
import viteSentry from 'vite-plugin-sentry'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) }

  return {
    plugins: [
      react(),
      svgr(),
      eslintPlugin(),
      viteSentry({
        url: 'https://newsentry.inqool.cz/',
        authToken: process.env.VITE_SENTRY_AUTH_TOKEN,
        org: 'inqool',
        project: 'permonik-frontend',
        deploy: {
          env: 'production',
        },
        setCommits: {
          auto: true,
          ignoreMissing: true,
        },
        sourceMaps: {
          include: ['./dist/assets'],
          ignore: ['node_modules'],
          ignoreFile: './.gitignore',
          urlPrefix: '~/assets',
        },
      }),
    ],
    build: {
      // required for sentry: tells vite to create source maps
      sourcemap: true,
    },
    server: {
      port: 3000,
      host: true,
    },
  }
})
