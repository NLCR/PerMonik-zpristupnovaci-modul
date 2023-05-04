import { FC } from 'react'
import { HelmetProvider } from 'react-helmet-async'
import { BrowserRouter } from 'react-router-dom'
import { Container } from '@mui/material'
import RoutesManager from './components/RoutesManager'
import ScrollToTop from './components/ScrollToTop'
import { useInitialLogin } from './utils/auth'
import Loader from './components/reusableComponents/Loader'

// App without react-router, useful for testing
const App: FC = () => {
  const { isLoading } = useInitialLogin()

  if (isLoading) {
    return (
      <Container>
        <Loader />
      </Container>
    )
  }

  return (
    <>
      {/* <Header /> */}
      <Container maxWidth="xl">
        <RoutesManager />
      </Container>
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
