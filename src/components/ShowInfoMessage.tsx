import React, { FC } from 'react'

import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline'
import Container from '@mui/material-pigment-css/Container'
import Box from '@mui/material-pigment-css/Box'

type TShowErrorProps = {
  message: string
}

const ShowInfoMessage: FC<TShowErrorProps> = ({ message }) => {
  return (
    <Container
      sx={{ marginTop: '50px', marginBottom: '50px', textAlign: 'center' }}
    >
      <ErrorOutlineIcon
        fontSize="large"
        sx={{ display: 'block', margin: '0 auto', marginBottom: '10px' }}
      />
      <Box component="span">{message}</Box>
    </Container>
  )
}

export default ShowInfoMessage
