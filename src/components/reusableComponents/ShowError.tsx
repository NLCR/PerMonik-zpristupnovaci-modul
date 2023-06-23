import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { Container, createStyles } from '@mantine/core'
import { IconTimelineEventExclamation } from '@tabler/icons-react'

const useStyles = createStyles(() => ({
  icon: {
    display: 'block',
    margin: '0 auto',
  },
}))

type TShowErrorProps = {
  error?: string
}

const ShowError: FC<TShowErrorProps> = ({ error = undefined }) => {
  const { t } = useTranslation()
  const { classes } = useStyles()

  return (
    <Container sx={{ marginTop: 50, marginBottom: 50, textAlign: 'center' }}>
      <IconTimelineEventExclamation size={50} className={classes.icon} />
      <span>{error || t('common.error_occurred_when_loading_data')}</span>
    </Container>
  )
}

export default ShowError
