import { FC } from 'react'
import SmsFailedOutlinedIcon from '@mui/icons-material/SmsFailedOutlined'
import { Container } from '@mui/material'

type TShowErrorProps = {
  message: string
}

const ShowInfoMessage: FC<TShowErrorProps> = ({ message }) => {
  return (
    <Container sx={{ textAlign: 'center' }}>
      <SmsFailedOutlinedIcon
        sx={{ display: 'block', mx: 'auto', fontSize: 50, mb: 3 }}
      />
      <span>{message}</span>
    </Container>
  )
}

export default ShowInfoMessage
