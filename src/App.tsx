import { FC } from 'react'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Container, createStyles, rem } from '@mantine/core'
import { DatesProvider } from '@mantine/dates'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { ModalsProvider } from '@mantine/modals'
import RoutesManager from './components/RoutesManager'
import ScrollToTop from './components/ScrollToTop'
import Header from './components/Header'
import 'dayjs/locale/cs'
import 'dayjs/locale/sk'
import 'dayjs/locale/en'
// import Footer from './components/Footer'

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: `calc(100vh - ${rem(60)})`,
    paddingTop: rem(20),
    backgroundColor: theme.colors.gray[0],
  },
}))

// App without react-router, useful for testing
const App: FC = () => {
  const { classes } = useStyles()

  return (
    <>
      <Header />
      <div className={classes.wrapper}>
        <Container
          size="xxl"
          sx={(theme) => ({
            paddingTop: theme.spacing.xl,
            paddingBottom: rem(50),
          })}
        >
          <RoutesManager />
        </Container>
      </div>
      {/* <Footer /> */}
    </>
  )
}

export const WrappedApp = () => {
  const { t, i18n } = useTranslation()

  dayjs.locale(i18n.resolvedLanguage)

  return (
    <BrowserRouter>
      <ModalsProvider>
        <HelmetProvider>
          <DatesProvider settings={{ locale: i18n.resolvedLanguage }}>
            <Helmet>
              <title>{t('helmet.title')}</title>
            </Helmet>
            <ScrollToTop />
            <App />
          </DatesProvider>
        </HelmetProvider>
      </ModalsProvider>
    </BrowserRouter>
  )
}

export default App
