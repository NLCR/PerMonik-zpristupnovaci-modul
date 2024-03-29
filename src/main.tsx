import React from 'react'
import ReactDOM from 'react-dom/client'
import { I18nextProvider } from 'react-i18next'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { QueryClientProvider } from '@tanstack/react-query'
import { init as SentryInit, BrowserTracing } from '@sentry/react'
import { MantineProvider, rem } from '@mantine/core'
import { ToastContainer } from 'react-toastify'
import i18next from './i18next'
import { queryClient } from './api'
import { WrappedApp } from './App'
import 'react-toastify/dist/ReactToastify.css'

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
  integrations: [new BrowserTracing()],
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
        <MantineProvider
          withGlobalStyles
          withNormalizeCSS
          theme={{
            loader: 'bars',
            fontFamily: 'Verdana, sans-serif',
            colorScheme: 'light',
            components: {
              Container: {
                defaultProps: {
                  sizes: {
                    xs: rem(540),
                    sm: rem(720),
                    md: rem(960),
                    lg: rem(1140),
                    xl: rem(1320),
                    xxl: rem(1700),
                  },
                },
              },
            },
          }}
        >
          <WrappedApp />
        </MantineProvider>
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
