/// <reference types="vite/client" />
/// <reference types="vite-plugin-svgr/client" />

interface ImportMetaEnv {
  readonly VITE_SENTRY_DNS: string
  readonly VITE_SENTRY_AUTH_TOKEN: string
}
