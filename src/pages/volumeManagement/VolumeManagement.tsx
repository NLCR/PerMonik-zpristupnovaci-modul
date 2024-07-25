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
import UpdateIcon from '@mui/icons-material/Update'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
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

  const setInitialState = useVolumeManagementStore(
    (state) => state.setInitialState
  )
  const volumeActions = useVolumeManagementStore((state) => state.volumeActions)
  const volumePeriodicityActions = useVolumeManagementStore(
    (state) => state.volumePeriodicityActions
  )
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

  const { doUpdate, doRegeneratedUpdate, doCreate, doDelete, pendingActions } =
    useVolumeManagementActions(publications || [])

  useEffect(() => {
    if (volume) {
      volumeActions.setVolumeState(volume.volume)
      specimensActions.setSpecimensState(volume.specimens)
      volumePeriodicityActions.setPeriodicityGenerationUsed(false)
    }
  }, [specimensActions, volume, volumeActions, volumePeriodicityActions])

  useEffect(() => {
    if (!volumeId) {
      setInitialState()
      if (publications) {
        volumePeriodicityActions.setDefaultPeriodicityPublication(publications)
      }
    }
  }, [publications, volumeId, volumePeriodicityActions, setInitialState])

  // TODO: filter actions based on volume state and user owner
  const actions = [
    {
      icon: <UpdateIcon />,
      name: t('administration.update'),
      onClick: doUpdate,
    },
    {
      icon: <UpdateIcon />,
      name: t('administration.update'),
      onClick: doRegeneratedUpdate,
    },
    {
      icon: <SaveIcon />,
      name: t('administration.save'),
      onClick: doCreate,
    },
    {
      icon: <DeleteForeverIcon />,
      name: t('administration.delete'),
      onClick: doDelete,
    },
  ]

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
    return <ShowInfoMessage message={t('volume_overview.account_required')} />
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
      {pendingActions ? (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 100,
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Loader />
        </Box>
      ) : null}
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
