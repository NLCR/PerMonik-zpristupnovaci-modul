/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly NODE_ENV: string
  readonly SENTRY_AUTH_TOKEN: string
  readonly SENTRY_ORG: string
  readonly SENTRY_PROJECT: string
  readonly SENTRY_URL: string
  readonly VITE_SENTRY_DNS: string
  readonly VITE_MUI_LICENCE_KEY: string
  readonly VITE_APP_TYPE: string
}
