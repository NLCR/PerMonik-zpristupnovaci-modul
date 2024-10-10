import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { init as SentryInit, browserTracingIntegration } from '@sentry/react'
import { ToastContainer } from 'react-toastify'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@mui/material/styles'
import i18next from './i18next'
import { queryClient } from './api'
import { WrappedApp } from './App'
import 'react-toastify/dist/ReactToastify.css'
import theme from './theme'
import './styles.css'
import { LicenseInfo } from '@mui/x-license'

const { NODE_ENV, VITE_SENTRY_DNS, VITE_MUI_LICENCE_KEY } = import.meta.env

// Setup Sentry for errors reporting in production
SentryInit({
  dsn: VITE_SENTRY_DNS,
  tracePropagationTargets: [
    'localhost',
    'permonik.nkp.cz',
    'permonik-test.nkp.cz',
    /^\//,
  ],
  integrations: [browserTracingIntegration()],
  environment: NODE_ENV,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: NODE_ENV === 'development' ? 0 : 0.5,
  beforeSend(event) {
    return NODE_ENV === 'development' ? null : event
  },
})

LicenseInfo.setLicenseKey(VITE_MUI_LICENCE_KEY)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <WrappedApp />
        </ThemeProvider>
      </I18nextProvider>
      <ReactQueryDevtools buttonPosition="bottom-left" />
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
