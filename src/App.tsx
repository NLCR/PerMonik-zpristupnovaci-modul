import { FC } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import Container from '@mui/material/Container'
import { useTranslation } from 'react-i18next'
import { AdapterDayjs } from '@mui/x-date-pickers-pro/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers-pro'
import dayjs from 'dayjs'
import localizedFormat from 'dayjs/plugin/localizedFormat'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
import utc from 'dayjs/plugin/utc'
import timezone from 'dayjs/plugin/timezone'
import RoutesManager from './components/RoutesManager'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import 'dayjs/locale/cs'
import 'dayjs/locale/sk'
import 'dayjs/locale/en'
// eslint-disable-next-line import/order
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
          maxHeight: `1200px`,
          height: `calc(100vh - 80px)`,
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
  dayjs.extend(utc)
  dayjs.extend(timezone)
  dayjs.tz.setDefault('Europe/Prague')
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
