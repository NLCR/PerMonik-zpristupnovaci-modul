import { FC } from 'react'
import { Container, createStyles } from '@mantine/core'
import { IconMessageCircleExclamation } from '@tabler/icons-react'

type TShowErrorProps = {
  message: string
}

const useStyles = createStyles(() => ({
  icon: {
    display: 'block',
    margin: '0 auto',
  },
}))

const ShowInfoMessage: FC<TShowErrorProps> = ({ message }) => {
  const { classes } = useStyles()

  return (
    <Container sx={{ textAlign: 'center', marginTop: 50, marginBottom: 50 }}>
      <IconMessageCircleExclamation size={50} className={classes.icon} />
      <span>{message}</span>
    </Container>
  )
}

export default ShowInfoMessage
