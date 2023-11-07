import { createStyles, Divider, Flex, rem } from '@mantine/core'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const useStyles = createStyles((theme) => ({
  container: {
    backgroundColor: 'white',
    padding: theme.spacing.lg,
    borderRadius: theme.spacing.xs,
    boxShadow: theme.shadows.xs,
    flexDirection: 'column',
    height: '80vh',
  },
  menu: {
    gap: theme.spacing.xs,
  },
  link: {
    display: 'block',
    lineHeight: 1,
    padding: `${rem(10)} ${rem(18)}`,
    borderRadius: theme.radius.sm,
    textDecoration: 'none',
    color: theme.colors.dark[9],
    fontSize: theme.fontSizes.md,
    fontWeight: 500,
    backgroundColor: theme.colors.blue[8],
    '&:hover': {
      backgroundColor: theme.colors.blue[6],
    },
    '&.active, &.active:hover': {
      backgroundColor: theme.fn.variant({
        variant: 'light',
        color: theme.primaryColor,
      }).background,
      // color: theme.fn.variant({ variant: 'light', color: theme.primaryColor })
      //   .color,
    },
  },
  divider: {
    marginTop: rem(10),
    marginBottom: rem(20),
    borderColor: theme.colors.gray[3],
  },
}))

const Administration = () => {
  const { classes } = useStyles()
  const { t, i18n } = useTranslation()

  return (
    <Flex className={classes.container}>
      <Flex className={classes.menu}>
        <NavLink
          className={classes.link}
          to={`/${i18n.resolvedLanguage}/${t('urls.administration')}/${t(
            'urls.users'
          )}`}
        >
          {t('administration.users')}
        </NavLink>
        <NavLink
          className={classes.link}
          to={`/${i18n.resolvedLanguage}/${t('urls.administration')}/${t(
            'urls.owners'
          )}`}
        >
          {t('administration.owners')}
        </NavLink>
      </Flex>
      <Divider className={classes.divider} />
      <Outlet />
    </Flex>
  )
}

export default Administration
