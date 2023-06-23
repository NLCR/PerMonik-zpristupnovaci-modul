import { Loader as MLoader } from '@mantine/core'

const Loader = () => {
  return (
    <MLoader
      sx={{
        marginTop: 50,
        marginBottom: 50,
        marginLeft: 'auto',
        marginRight: 'auto',
        display: 'block',
      }}
    />
  )
}

export default Loader
