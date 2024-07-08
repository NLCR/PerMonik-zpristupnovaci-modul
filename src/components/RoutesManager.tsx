import React, { Suspense, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes, useLocation, Navigate } from 'react-router-dom'
import { Container } from '@mantine/core'
import { modals } from '@mantine/modals'
import NotFound from '../pages/NotFound'
import Home from '../pages/Home'
import Loader from './reusableComponents/Loader'
import SpecimensOverview from '../pages/SpecimensOverview'
import { useMeQuery } from '../api/user'
import Administration from '../pages/administration/Administration'
import Users from '../pages/administration/Users'
import Owners from '../pages/administration/Owners'
import MetaTitles from '../pages/administration/MetaTitles'

const VolumeOverview = React.lazy(() => import('../pages/VolumeOverview'))

const SuspenseLoader = () => {
  return (
    <Container sx={{ minHeight: '80vh' }}>
      <Loader />
    </Container>
  )
}

const RoutesManager = () => {
  const location = useLocation()
  const { t } = useTranslation('global', { keyPrefix: 'urls' })
  const { data: me } = useMeQuery()

  useEffect(() => {
    modals.closeAll()
  }, [location])

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/:lang" element={<Home />} />
        <Route
          path={`/:lang/${t('specimens_overview')}/:metaTitleId`}
          element={<SpecimensOverview />}
        />
        <Route
          path={`/:lang/${t('volume_overview')}/:volumeId`}
          element={<VolumeOverview />}
        />
        {me?.role === 'admin' ? (
          <Route
            path={`/:lang/${t('administration')}`}
            element={<Administration />}
          >
            <Route index element={<Navigate to={t('users')} />} />
            <Route path={t('users')} element={<Users />} />
            <Route path={t('owners')} element={<Owners />} />
            <Route path={t('metaTitles')} element={<MetaTitles />} />
          </Route>
        ) : null}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default RoutesManager
