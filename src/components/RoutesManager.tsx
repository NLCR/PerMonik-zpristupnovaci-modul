import React, { Suspense } from 'react'
import { useTranslation } from 'react-i18next'
import { Route, Routes, Navigate } from 'react-router-dom'
import Container from '@mui/material/Container'
import NotFound from '../pages/NotFound'
import Home from '../pages/Home'
import Loader from './Loader'
import SpecimensOverview from '../pages/specimensOverview/SpecimensOverview'
import { useMeQuery } from '../api/user'
import { APP_WITH_EDITING_ENABLED } from '../utils/constants'

const Administration = React.lazy(
  () => import('../pages/administration/Administration')
)
const Users = React.lazy(() => import('../pages/administration/Users'))
const Owners = React.lazy(() => import('../pages/administration/Owners'))
const MetaTitles = React.lazy(
  () => import('../pages/administration/MetaTitles')
)
const Publications = React.lazy(
  () => import('../pages/administration/Publications')
)
const Mutations = React.lazy(() => import('../pages/administration/Mutations'))

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

  const canUseEditing = APP_WITH_EDITING_ENABLED && !!me

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
        {canUseEditing ? (
          <>
            <Route
              path={`/:lang/${t('volume_overview')}`}
              element={<VolumeManagement />}
            />
            <Route
              path={`/:lang/${t('volume_overview')}/duplicated`}
              element={<VolumeManagement duplicated={true} />}
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
        {canUseEditing && me?.role?.includes('admin') ? (
          <Route
            path={`/:lang/${t('administration')}`}
            element={<Administration />}
          >
            <Route index element={<Navigate to={t('users')} />} />
            <Route path={t('users')} element={<Users me={me} />} />
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
