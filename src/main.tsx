import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { init as SentryInit, BrowserTracing } from '@sentry/react'
import { ThemeProvider } from '@mui/material'
import i18next from './i18next'
import { queryClient } from './api'
import 'virtual:vite-plugin-sentry/sentry-config'
import { WrappedApp } from './App'
import theme from './utils/theme'

// development or production
const { MODE } = import.meta.env

// Setup Sentry for errors reporting in production
SentryInit({
  dsn: import.meta.env.VITE_SENTRY_DNS,
  integrations: [
    new BrowserTracing({
      tracePropagationTargets: [
        'localhost',
        // 'permonik.cz',
        // 'api.permonik.com',
        /^\//,
      ],
    }),
  ],
  environment: MODE,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: MODE === 'development' ? 0 : 0.2,
  beforeSend(event) {
    return MODE === 'development' ? null : event
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider theme={theme}>
          <WrappedApp />
        </ThemeProvider>
      </I18nextProvider>
      <ReactQueryDevtools />
    </QueryClientProvider>
    <ToastContainer
      position="bottom-left"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  </React.StrictMode>
)
