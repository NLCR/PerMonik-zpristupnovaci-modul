import React, { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, Box } from '@mui/material'
import ErrorOutlinedIcon from '@mui/icons-material/ErrorOutlined'

type TShowErrorProps = {
  error?: string
}

const ShowError: FC<TShowErrorProps> = ({ error = undefined }) => {
  const { t } = useTranslation()

  return (
    <Container
      sx={{ marginTop: '50px', marginBottom: '50px', textAlign: 'center' }}
    >
      <ErrorOutlinedIcon
        fontSize="large"
        sx={{ display: 'block', margin: '0 auto', marginBottom: '10px' }}
      />
      <Box component="span">
        {error || t('common.error_occurred_when_loading_data')}
      </Box>
    </Container>
  )
}

export default ShowError
