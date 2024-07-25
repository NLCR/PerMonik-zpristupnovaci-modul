import { FC } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Container } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
import RoutesManager from './components/RoutesManager'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import 'dayjs/locale/cs'
import 'dayjs/locale/sk'
import 'dayjs/locale/en'
// eslint-disable-next-line import/order
import localeData from 'dayjs/plugin/localeData'
// import Footer from './components/Footer'

// App without react-router, useful for testing
const App: FC = () => {
  return (
    <>
      <Header />
      <Container
        maxWidth="xl"
        sx={{
          display: 'flex',
          // flexDirection: 'column',
          paddingTop: '15px',
          paddingBottom: '10px',
          maxHeight: `calc(100vh - 64px)`,
          minHeight: `calc(100vh - 64px)`,
          width: '100%',
          // maxHeight: `700px`,
          // overflow: 'hidden',
        }}
      >
        <RoutesManager />
      </Container>
      {/* <Footer /> */}
    </>
  )
}

export const WrappedApp = () => {
  const { t, i18n } = useTranslation()

  dayjs.extend(localizedFormat)
  dayjs.extend(weekday)
  dayjs.extend(localeData)
  dayjs.locale(i18n.resolvedLanguage)

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={i18n.resolvedLanguage}
    >
      <BrowserRouter>
        <HelmetProvider>
          <Helmet>
            <title>{t('helmet.title')}</title>
          </Helmet>
          <ScrollToTop />
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </LocalizationProvider>
  )
}

export default App
