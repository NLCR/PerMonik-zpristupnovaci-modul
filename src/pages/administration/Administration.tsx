import React from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Box, Divider } from '@mui/material'
import styled from '@emotion/styled'

const Container = styled(Box)(({ theme }) => ({
  backgroundColor: 'white',
  padding: theme.spacing(4),
  borderRadius: theme.spacing(1),
  boxShadow: theme.shadows[1],
  display: 'flex',
  width: '100%',
  flexDirection: 'column',
  marginBottom: '5px',
  // height: '80vh',
}))

const Menu = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
}))

const Link = styled(NavLink)(({ theme }) => ({
  display: 'block',
  lineHeight: 1,
  padding: `${theme.spacing(1.25)} ${theme.spacing(2.25)}`,
  borderRadius: theme.shape.borderRadius,
  textDecoration: 'none',
  color: theme.palette.text.primary,
  fontSize: theme.typography.pxToRem(16),
  fontWeight: 500,
  backgroundColor: theme.palette.primary.main,
  '&:hover': {
    backgroundColor: theme.palette.primary.light,
  },
  '&.active, &.active:hover': {
    backgroundColor: theme.palette.primary.light,
  },
}))

const StyledDivider = styled(Divider)(({ theme }) => ({
  marginTop: theme.spacing(1.25),
  marginBottom: theme.spacing(2.5),
  borderColor: theme.palette.grey[300],
}))

const Administration = () => {
  const { t, i18n } = useTranslation()

  return (
    <Container>
      <Menu>
        <Link
          to={`/${i18n.resolvedLanguage}/${t('urls.administration')}/${t('urls.users')}`}
        >
          {t('administration.users')}
        </Link>
        <Link
          to={`/${i18n.resolvedLanguage}/${t('urls.administration')}/${t('urls.owners')}`}
        >
          {t('administration.owners')}
        </Link>
        <Link
          to={`/${i18n.resolvedLanguage}/${t('urls.administration')}/${t('urls.meta_titles')}`}
        >
          {t('administration.meta_titles')}
        </Link>
        <Link
          to={`/${i18n.resolvedLanguage}/${t('urls.administration')}/${t('urls.publications')}`}
        >
          {t('administration.publications')}
        </Link>
        <Link
          to={`/${i18n.resolvedLanguage}/${t('urls.administration')}/${t('urls.mutations')}`}
        >
          {t('administration.mutations')}
        </Link>
      </Menu>
      <StyledDivider />
      <Outlet />
    </Container>
  )
}

export default Administration
