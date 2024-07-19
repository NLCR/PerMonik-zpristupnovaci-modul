import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Flex } from '@mantine/core'
import React, { useEffect } from 'react'
import { useMangedVolumeDetailQuery } from '../../api/volume'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import ShowInfoMessage from '../../components/ShowInfoMessage'
import { useMutationListQuery } from '../../api/mutation'
import { useOwnerListQuery } from '../../api/owner'
import { usePublicationListQuery } from '../../api/publication'
import { useMeQuery } from '../../api/user'
import SpecimensTable from './components/Table'
import { useMetaTitleListQuery } from '../../api/metaTitle'
import { useVolumeManagementStore } from '../../slices/useVolumeManagementStore'
import InputData from './components/InputData'

const VolumeManagement = () => {
  const { volumeId } = useParams()
  const { data: me, isLoading: meLoading, isError: meError } = useMeQuery()
  const { t } = useTranslation()

  const volumeActions = useVolumeManagementStore((state) => state.volumeActions)
  const specimensActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )

  const {
    data: mutations,
    isLoading: mutationsLoading,
    isError: mutationsError,
  } = useMutationListQuery()
  const {
    data: owners,
    isLoading: ownersLoading,
    isError: ownersError,
  } = useOwnerListQuery()
  const {
    data: volume,
    isLoading: volumeLoading,
    isError: volumeError,
  } = useMangedVolumeDetailQuery(volumeId)
  const {
    data: publications,
    isLoading: publicationsLoading,
    isError: publicationsError,
  } = usePublicationListQuery()
  const {
    data: metaTitles,
    isLoading: metaTitlesLoading,
    isError: metaTitlesError,
  } = useMetaTitleListQuery()

  useEffect(() => {
    if (volume) {
      volumeActions.setVolumeState(volume.volume)
      specimensActions.setSpecimensState(volume.specimens)
    }
  }, [specimensActions, volume, volumeActions])

  if (
    volumeLoading ||
    publicationsLoading ||
    mutationsLoading ||
    ownersLoading ||
    metaTitlesLoading ||
    meLoading
  )
    return <Loader />
  if (
    volumeError ||
    publicationsError ||
    mutationsError ||
    ownersError ||
    metaTitlesError ||
    meError
  )
    return <ShowError />
  if (
    (!volume && volumeId?.length) ||
    !publications ||
    !mutations ||
    !owners ||
    !metaTitles
  ) {
    return <ShowInfoMessage message={t('volume_overview.not_found')} />
  }

  if (!me) {
    // TODO: translation
    return <ShowInfoMessage message="Účet nenalezen" />
  }

  const canEdit =
    me.owners.some((o) => o === volume?.volume.ownerId) || !volumeId?.length

  return (
    <Flex
      sx={{
        alignItems: 'stretch',
        justifyContent: 'space-between',
      }}
    >
      <InputData
        canEdit={canEdit}
        me={me}
        mutations={mutations}
        owners={owners}
        publications={publications}
        metaTitles={metaTitles}
      />
      <SpecimensTable
        canEdit={canEdit}
        mutations={mutations}
        publications={publications}
      />
    </Flex>
  )
}

export default VolumeManagement
