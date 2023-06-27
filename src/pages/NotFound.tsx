import { useTranslation } from 'react-i18next'
import { Box } from '@mantine/core'
import ShowInfoMessage from '../components/reusableComponents/ShowInfoMessage'

const NotFound = () => {
  const { t } = useTranslation()

  return (
    <Box sx={{ textAlign: 'center' }}>
      <h1>404</h1>
      <ShowInfoMessage message={t('not_found.page_dont_exists')} />
    </Box>
  )
}

export default NotFound
