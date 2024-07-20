import { FC } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Container } from '@mui/material'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import RoutesManager from './components/RoutesManager'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import 'dayjs/locale/cs'
import 'dayjs/locale/sk'
import 'dayjs/locale/en'
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

  dayjs.locale(i18n.resolvedLanguage)

  return (
    <BrowserRouter>
      <HelmetProvider>
        <Helmet>
          <title>{t('helmet.title')}</title>
        </Helmet>
        <ScrollToTop />
        <App />
      </HelmetProvider>
    </BrowserRouter>
  )
}

export default App
