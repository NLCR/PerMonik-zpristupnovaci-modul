import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Container } from '@mui/material'

type TShowErrorProps = {
  error?: string
}

const ShowError: FC<TShowErrorProps> = ({ error = undefined }) => {
  const { t } = useTranslation()

  return (
    <Container xs={{ my: 16, textAlign: 'center' }}>
      <h2>Ooops</h2>
      <span>{error || t('common.error_occurred_when_loading_data')}</span>
    </Container>
  )
}

export default ShowError
