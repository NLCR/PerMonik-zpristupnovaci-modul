import { Container, createStyles, Footer as MFooter, Text } from '@mantine/core'

const useStyles = createStyles(() => ({
  footer: {
    // marginTop: theme.spacing.xl,
  },
  container: {
    padding: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-end',
  },
}))

const Footer = () => {
  const { classes } = useStyles()

  return (
    <MFooter height={40} className={classes.footer}>
      <Container className={classes.container} size="xl">
        <Text size="xs">Copyright Permonik 2023</Text>
      </Container>
    </MFooter>
  )
}

export default Footer
