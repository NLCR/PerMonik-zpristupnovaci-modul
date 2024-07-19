import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes, Navigate } from 'react-router-dom'
import { Container } from '@mui/material'
import NotFound from '../pages/NotFound'
import Home from '../pages/Home'
import Loader from './Loader'
import SpecimensOverview from '../pages/specimensOverview/SpecimensOverview'
import { useMeQuery } from '../api/user'
import Administration from '../pages/administration/Administration'
import Users from '../pages/administration/Users'
import Owners from '../pages/administration/Owners'
import MetaTitles from '../pages/administration/MetaTitles'
import Publications from '../pages/administration/Publications'
import Mutations from '../pages/administration/Mutations'

const VolumeOverview = React.lazy(
  () => import('../pages/volumeOverview/VolumeOverview')
)
const VolumeManagement = React.lazy(
  () => import('../pages/volumeManagement/VolumeManagement')
)

const SuspenseLoader = () => {
  return (
    <Container sx={{ minHeight: '80vh' }}>
      <Loader />
    </Container>
  )
}

const RoutesManager = () => {
  const { t } = useTranslation('global', { keyPrefix: 'urls' })
  const { data: me, isLoading: meLoading } = useMeQuery()

  if (meLoading) {
    return <Loader />
  }

  return (
    <Suspense fallback={<SuspenseLoader />}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="/:lang" element={<Home />} />
        <Route
          path={`/:lang/${t('specimens_overview')}/:metaTitleId`}
          element={<SpecimensOverview />}
        />
        {me ? (
          <>
            <Route
              path={`/:lang/${t('volume_overview')}`}
              element={<VolumeManagement />}
            />
            <Route
              path={`/:lang/${t('volume_overview')}/:volumeId`}
              element={<VolumeManagement />}
            />
          </>
        ) : (
          <Route
            path={`/:lang/${t('volume_overview')}/:volumeId`}
            element={<VolumeOverview />}
          />
        )}
        {me?.role === 'admin' ? (
          <Route
            path={`/:lang/${t('administration')}`}
            element={<Administration />}
          >
            <Route index element={<Navigate to={t('users')} />} />
            <Route path={t('users')} element={<Users />} />
            <Route path={t('owners')} element={<Owners />} />
            <Route path={t('meta_titles')} element={<MetaTitles />} />
            <Route path={t('publications')} element={<Publications />} />
            <Route path={t('mutations')} element={<Mutations />} />
          </Route>
        ) : null}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}

export default RoutesManager
