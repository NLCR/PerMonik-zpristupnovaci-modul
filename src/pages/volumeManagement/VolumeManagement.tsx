import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import Typography from '@mui/material/Typography'
import React, { useEffect, useMemo, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import { blue } from '@mui/material/colors'
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
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Button from '@mui/material/Button'

const modalStyle = {
  overflowY: 'auto',
  position: 'absolute' as const,
  maxHeight: '200px',
  height: '80vh',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '400px',
  bgcolor: 'background.paper',
  borderRadius: '4px',
  boxShadow: 24,
  p: 4,
}

const VolumeManagement = () => {
  const { volumeId } = useParams()
  const { data: me, isLoading: meLoading, isError: meError } = useMeQuery()
  const { t } = useTranslation()

  const [confirmDeletionModalStage, setConfirmDeletionModalStage] = useState({
    opened: false,
    stage: 1,
  })

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
  const volumeRegenerated = useVolumeManagementStore(
    (state) => state.periodicityGenerationUsed
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

  const handleDeletion = () => {
    doDelete()
  }

  const canEdit = useMemo(
    () =>
      me?.owners?.some((o) => o === volume?.volume.ownerId) ||
      !volumeId?.length ||
      me?.role === 'super_admin',
    [me, volume?.volume.ownerId, volumeId?.length]
  )

  const actions = useMemo(() => {
    const actionsArray: {
      icon: JSX.Element
      name: string
      onClick: () => void
    }[] = []

    if (volumeId && volumeRegenerated) {
      actionsArray.push({
        icon: <SaveAsIcon />,
        // name: t('administration.update'),
        name: t('administration.save'),
        onClick: doRegeneratedUpdate,
      })
    }
    if (volumeId && !volumeRegenerated) {
      actionsArray.push({
        icon: <SaveAsIcon />,
        // name: t('administration.update'),
        name: t('administration.save'),
        onClick: doUpdate,
      })
    }
    if (volumeId) {
      actionsArray.push({
        icon: <DeleteForeverIcon />,
        name: t('administration.delete'),
        onClick: () => setConfirmDeletionModalStage({ opened: true, stage: 1 }),
      })
    }
    if (!volumeId) {
      actionsArray.push({
        icon: <SaveIcon />,
        name: t('administration.save'),
        onClick: doCreate,
      })
    }

    return actionsArray
  }, [doCreate, doRegeneratedUpdate, doUpdate, t, volumeId, volumeRegenerated])

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
          sx={{
            marginBottom: '8px',
            color: blue['900'],
            fontWeight: 'bold',
            fontSize: '24px',
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
          sx={{
            marginBottom: '8px',
            color: blue['900'],
            fontWeight: 'bold',
            fontSize: '24px',
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
      {canEdit ? (
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
      ) : null}
      {confirmDeletionModalStage.opened ? (
        <Modal
          open={confirmDeletionModalStage.opened}
          onClose={() => {
            setConfirmDeletionModalStage((prevState) => ({
              ...prevState,
              opened: false,
            }))
          }}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              color: '#fff',
              timeout: 500,
            },
          }}
        >
          <Fade in={confirmDeletionModalStage.opened}>
            <Box sx={modalStyle}>
              <Typography
                sx={{
                  color: blue['900'],
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                {t('volume_overview.delete_volume_caption')}
              </Typography>
              <Typography
                sx={{
                  marginBottom: '16px',
                }}
              >
                {confirmDeletionModalStage.stage === 1
                  ? t('volume_overview.delete_volume_text')
                  : t('volume_overview.delete_volume_text2')}
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                }}
              >
                {confirmDeletionModalStage.stage === 1 ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() =>
                        setConfirmDeletionModalStage((prevState) => ({
                          ...prevState,
                          stage: 2,
                        }))
                      }
                    >
                      {t('common.yes')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        setConfirmDeletionModalStage((prevState) => ({
                          ...prevState,
                          opened: false,
                        }))
                      }
                    >
                      {t('common.no')}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setConfirmDeletionModalStage((prevState) => ({
                          ...prevState,
                          opened: false,
                        }))
                        handleDeletion()
                      }}
                    >
                      {t('common.no')}
                    </Button>
                    <Button
                      variant="contained"
                      onClick={() =>
                        setConfirmDeletionModalStage((prevState) => ({
                          ...prevState,
                          opened: false,
                        }))
                      }
                    >
                      {t('common.yes')}
                    </Button>
                  </>
                )}
              </Box>
            </Box>
          </Fade>
        </Modal>
      ) : null}
    </Box>
  )
}

export default VolumeManagement
