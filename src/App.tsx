import { FC } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Container, createStyles } from '@mantine/core'
import RoutesManager from './components/RoutesManager'
import ScrollToTop from './components/ScrollToTop'
import { useInitialLogin } from './utils/auth'
import Loader from './components/reusableComponents/Loader'
import Header from './components/Header'
// import Footer from './components/Footer'

const useStyles = createStyles((theme) => ({
  wrapper: {
    minHeight: 'calc(100vh - 60px)',
    paddingTop: 40,
    backgroundColor: theme.colors.gray[0],
  },
}))

// App without react-router, useful for testing
const App: FC = () => {
  const { classes } = useStyles()
  const { isLoading } = useInitialLogin()

  if (isLoading) {
    return (
      <div className={classes.wrapper}>
        <Container>
          <Loader />
        </Container>
      </div>
    )
  }

  return (
    <>
      <Header />
      <div className={classes.wrapper}>
        <Container
          size="xxl"
          sx={(theme) => ({
            paddingTop: theme.spacing.xl,
            paddingBottom: 50,
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
  return (
    <BrowserRouter>
      <HelmetProvider>
        <ScrollToTop />
        <App />
      </HelmetProvider>
    </BrowserRouter>
  )
}

export default App
