/// <reference types="vitest" />

import { defineConfig } from 'vitest/config'

//Setup tests
export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
  },
})
