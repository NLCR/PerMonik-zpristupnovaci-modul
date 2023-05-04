import { useTranslation } from 'react-i18next'
import { Container } from '@mui/material'
import ShowInfoMessage from '../components/reusableComponents/ShowInfoMessage'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Container sx={{ mt: 10, textAlign: 'center' }}>
      <h1>404</h1>
      <ShowInfoMessage message={t('not_found.page_dont_exists')} />
    </Container>
  )
}

export default NotFound
