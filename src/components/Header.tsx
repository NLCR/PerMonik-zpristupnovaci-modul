import {
  createStyles,
  Header as MHeader,
  Container,
  Group,
  Burger,
  rem,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../assets/logo.png'

const useStyles = createStyles((theme) => ({
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },
  headerContainer: {
    backgroundColor: theme.colors.blue,
  },
  links: {
    [theme.fn.smallerThan('xs')]: {
      display: 'none',
    },
  },

  burger: {
    [theme.fn.largerThan('xs')]: {
      display: 'none',
    },
  },

  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(8)} ${rem(12)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color:
      theme.colorScheme === 'dark'
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,

    '&:hover': {
      backgroundColor:
        theme.colorScheme === 'dark'
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
    '&.active, &.active:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
        .color,
    },
  },
}))

const Header = () => {
  const [opened, { toggle }] = useDisclosure(false)
  const { t } = useTranslation()
  const { classes } = useStyles()

  return (
    <MHeader height={60} className={classes.headerContainer}>
      <Container className={classes.header} size="xxl">
        <Link to="/">
          <img src={Logo} alt="Logo" />
        </Link>
        <Group spacing={5} className={classes.links}>
          <NavLink to="/" className={classes.link}>
            {t('header.home')}
          </NavLink>
          <NavLink to={`/${t('urls.login')}`} className={classes.link}>
            {t('header.login')}
          </NavLink>
        </Group>
        <Burger
          opened={opened}
          onClick={toggle}
          className={classes.burger}
          size="sm"
        />
      </Container>
    </MHeader>
  )
}

export default Header
