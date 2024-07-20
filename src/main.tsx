import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { init as SentryInit, browserTracingIntegration } from '@sentry/react'
import { ToastContainer } from 'react-toastify'
import CssBaseline from '@mui/material/CssBaseline'
import { ThemeProvider } from '@emotion/react'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import i18next from './i18next'
import { queryClient } from './api'
import { WrappedApp } from './App'
import 'react-toastify/dist/ReactToastify.css'
import theme from './theme'
// eslint-disable-next-line import/order
import { LocalizationProvider } from '@mui/x-date-pickers'
import './styles.css'

const { MODE, VITE_SENTRY_DNS } = import.meta.env

// Setup Sentry for errors reporting in production
SentryInit({
  dsn: VITE_SENTRY_DNS,
  tracePropagationTargets: [
    'localhost',
    // 'permonik.cz',
    // 'api.permonik.com',
    /^\//,
  ],
  integrations: [browserTracingIntegration()],
  environment: MODE,
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: MODE === 'development' ? 0 : 0.5,
  beforeSend(event) {
    return MODE === 'development' ? null : event
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <I18nextProvider i18n={i18next}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <WrappedApp />
          </LocalizationProvider>
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
