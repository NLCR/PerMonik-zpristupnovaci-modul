import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  Typography,
  useTheme,
} from '@mui/material'
import React, { useEffect } from 'react'
import SaveIcon from '@mui/icons-material/Save'
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
import { useVolumeManagementActions } from '../../hooks/useVolumeManagementActions'

const VolumeManagement = () => {
  const theme = useTheme()
  const { volumeId } = useParams()
  const { data: me, isLoading: meLoading, isError: meError } = useMeQuery()
  const { t } = useTranslation()

  const volumeActions = useVolumeManagementStore((state) => state.volumeActions)
  const specimensActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )

  const { doUpdate } = useVolumeManagementActions()

  const actions = [
    {
      icon: <SaveIcon />,
      name: t('administration.save'),
      onClick: doUpdate,
    },
  ]

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
    me.owners.some((o) => o === volume?.volume.ownerId) ||
    !volumeId?.length ||
    me.role === 'super_admin'

  return (
    <Box
      sx={{
        display: 'flex',
        gap: '16px',
        width: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: '380px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          // boxShadow: theme.shadows[1],
          flexShrink: 0,
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: '8px',
            color: theme.palette.blue['900'],
          }}
        >
          {t('volume_overview.volume_information')}
        </Typography>
        <InputData
          canEdit={canEdit}
          me={me}
          mutations={mutations}
          owners={owners}
          publications={publications}
          metaTitles={metaTitles}
        />
      </Box>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          width: '100%',
          overflow: 'auto',
          // boxShadow: theme.shadows[1],
        }}
      >
        <Typography
          variant="h5"
          sx={{
            marginBottom: '8px',
            color: theme.palette.blue['900'],
          }}
        >
          {t('volume_overview.volume_description')}
        </Typography>
        <SpecimensTable
          canEdit={canEdit}
          mutations={mutations}
          publications={publications}
        />
      </Box>
      <SpeedDial
        ariaLabel=""
        sx={{ position: 'absolute', bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </Box>
  )
}

export default VolumeManagement
