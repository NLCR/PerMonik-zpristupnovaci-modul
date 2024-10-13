import {
  type BlockerFunction,
  Link,
  useBlocker,
  useParams,
  useSearchParams,
  useBeforeUnload,
} from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import React, { FC, useCallback, useEffect, useMemo, useState } from 'react'
import SaveIcon from '@mui/icons-material/Save'
import SaveAsIcon from '@mui/icons-material/SaveAs'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { blue } from '@mui/material/colors'
import { useManagedVolumeDetailQuery } from '../../api/volume'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import ShowInfoMessage from '../../components/ShowInfoMessage'
import { useMutationListQuery } from '../../api/mutation'
import { useOwnerListQuery } from '../../api/owner'
import { useEditionListQuery } from '../../api/edition'
import { useMeQuery } from '../../api/user'
import SpecimensTable from './components/Table'
import { useMetaTitleListQuery } from '../../api/metaTitle'
import { useVolumeManagementStore } from '../../slices/useVolumeManagementStore'
import InputData from './components/InputData'
import useVolumeManagementActions from '../../hooks/useVolumeManagementActions'
import Button from '@mui/material/Button'
import { BACK_META_TITLE_ID } from '../../utils/constants'
import ModalContainer from '../../components/ModalContainer'
import VolumeOverviewStatsModal from '../specimensOverview/components/VolumeOverviewStatsModal'
import Periodicity from './components/Periodicity'
import { validate as uuidValidate } from 'uuid'

type TVolumeManagementProps = {
  duplicated?: boolean
}

const VolumeManagement: FC<TVolumeManagementProps> = ({
  duplicated = false,
}) => {
  const { volumeId } = useParams()
  const { data: me, isLoading: meLoading, isError: meError } = useMeQuery()
  const { t, i18n } = useTranslation()

  const [searchParams] = useSearchParams()

  const [volumeStatsModalOpened, setVolumeStatsModalOpened] = useState(false)
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
  const stateHasUnsavedData = useVolumeManagementStore(
    (state) => state.stateHasUnsavedData
  )

  useBeforeUnload((event) => {
    if (stateHasUnsavedData) {
      event.preventDefault()
      event.returnValue = t('volume_overview.unsaved_changes')
    }
  })

  const shouldBlockNavigationChange = useCallback<BlockerFunction>(
    ({ currentLocation, nextLocation }) =>
      stateHasUnsavedData && currentLocation.pathname !== nextLocation.pathname,
    [stateHasUnsavedData]
  )

  const blocker = useBlocker(shouldBlockNavigationChange)

  useEffect(() => {
    if (blocker.state === 'blocked' && !stateHasUnsavedData) {
      blocker.reset()
    }
  }, [blocker, stateHasUnsavedData])

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
  } = useManagedVolumeDetailQuery(volumeId)
  const {
    data: editions,
    isLoading: editionsLoading,
    isError: editionsError,
  } = useEditionListQuery()
  const {
    data: metaTitles,
    isLoading: metaTitlesLoading,
    isError: metaTitlesError,
  } = useMetaTitleListQuery()

  const backMetaTitle = useMemo(
    () =>
      uuidValidate(searchParams.get(BACK_META_TITLE_ID) || '')
        ? searchParams.get(BACK_META_TITLE_ID)
        : volume?.volume.metaTitleId,
    [searchParams, volume?.volume.metaTitleId]
  )

  const {
    doDuplicate,
    doUpdate,
    doRegeneratedUpdate,
    doCreate,
    doDelete,
    pendingActions,
  } = useVolumeManagementActions(editions || [])

  useEffect(() => {
    if (volume?.volume) {
      volumeActions.setVolumeState(volume.volume, false)
      specimensActions.setSpecimensState(volume.specimens, false)
      volumePeriodicityActions.setPeriodicityGenerationUsed(false)
    }
  }, [specimensActions, volume, volumeActions, volumePeriodicityActions])

  useEffect(() => {
    if (!volumeId && !duplicated) {
      setInitialState()
      if (editions) {
        volumePeriodicityActions.setDefaultPeriodicityEdition(editions)
      }
    }
  }, [
    editions,
    volumeId,
    volumePeriodicityActions,
    setInitialState,
    duplicated,
  ])

  const handleDeletion = () => {
    doDelete()
  }

  const canEdit = useMemo(
    () =>
      me?.owners?.some((o) => o === volume?.volume?.ownerId) ||
      !volumeId?.length ||
      me?.role === 'super_admin',
    [me, volume?.volume, volumeId?.length]
  )

  const actions = useMemo(() => {
    const actionsArray: {
      icon: JSX.Element
      name: string
      color: 'primary' | 'secondary' | 'error'
      onClick: () => void
    }[] = []

    if (volumeId && volumeRegenerated) {
      actionsArray.push(
        {
          icon: <ContentCopyIcon />,
          name: t('administration.duplicate_volume'),
          color: 'primary',
          onClick: () => doDuplicate(),
        },
        {
          icon: <CheckCircleIcon />,
          name: t('administration.verified'),
          color: 'primary',
          onClick: () => doRegeneratedUpdate(true),
        },
        {
          icon: <SaveAsIcon />,
          name: t('administration.save'),
          color: 'primary',
          onClick: () => doRegeneratedUpdate(),
        }
      )
    }
    if (volumeId && !volumeRegenerated) {
      actionsArray.push(
        {
          icon: <ContentCopyIcon />,
          name: t('administration.duplicate_volume'),
          color: 'primary',
          onClick: () => doDuplicate(),
        },
        {
          icon: <CheckCircleIcon />,
          name: t('administration.verified'),
          color: 'primary',
          onClick: () => doUpdate(true),
        },
        {
          icon: <SaveAsIcon />,
          name: t('administration.save'),
          color: 'primary',
          onClick: () => doUpdate(),
        }
      )
    }
    if (volumeId) {
      actionsArray.push({
        icon: <DeleteForeverIcon />,
        name: t('administration.delete'),
        color: 'error',
        onClick: () => setConfirmDeletionModalStage({ opened: true, stage: 1 }),
      })
    }
    if (!volumeId) {
      actionsArray.push(
        {
          icon: <CheckCircleIcon />,
          name: t('administration.verified'),
          color: 'primary',
          onClick: () => doCreate(true),
        },
        {
          icon: <SaveIcon />,
          name: t('administration.save'),
          color: 'primary',
          onClick: () => doCreate(),
        }
      )
    }

    return actionsArray
  }, [
    doDuplicate,
    doCreate,
    doRegeneratedUpdate,
    doUpdate,
    t,
    volumeId,
    volumeRegenerated,
  ])

  if (
    volumeLoading ||
    editionsLoading ||
    mutationsLoading ||
    ownersLoading ||
    metaTitlesLoading ||
    meLoading
  )
    return <Loader />
  if (
    volumeError ||
    editionsError ||
    mutationsError ||
    ownersError ||
    metaTitlesError ||
    meError
  )
    return <ShowError />
  if (
    (!volume && volumeId?.length) ||
    !editions ||
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
          editions={editions}
        />
        <Box
          sx={{
            marginTop: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {backMetaTitle?.length ? (
              <Button
                component={Link}
                variant="outlined"
                to={`/${i18n.resolvedLanguage}/${t('urls.specimens_overview')}/${backMetaTitle}`}
              >
                {t('volume_overview.back_to_specimens_overview')}
              </Button>
            ) : null}
            {volumeId ? (
              <Button
                variant="outlined"
                onClick={() => setVolumeStatsModalOpened(true)}
              >
                {t('specimens_overview.volume_overview_modal_link')}
              </Button>
            ) : null}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: '8px',
              alignItems: 'center',
            }}
          >
            {canEdit ? (
              <>
                <Periodicity canEdit={canEdit} editions={editions} />
                {actions.map((action) => (
                  <Button
                    variant="contained"
                    color={action.color}
                    key={action.name}
                    startIcon={action.icon}
                    onClick={action.onClick}
                  >
                    {action.name}
                  </Button>
                ))}
              </>
            ) : null}
          </Box>
        </Box>
      </Box>
      <ModalContainer
        onClose={() =>
          setConfirmDeletionModalStage((prevState) => ({
            ...prevState,
            opened: false,
          }))
        }
        header={
          confirmDeletionModalStage.stage === 1
            ? t('volume_overview.delete_volume_text')
            : t('volume_overview.delete_volume_text2')
        }
        opened={!!volumeId?.length && confirmDeletionModalStage.opened}
        acceptButton={{
          callback: () => {
            if (confirmDeletionModalStage.stage === 1) {
              setConfirmDeletionModalStage((prevState) => ({
                ...prevState,
                opened: false,
              }))
            }
            if (confirmDeletionModalStage.stage === 2) {
              setConfirmDeletionModalStage((prevState) => ({
                ...prevState,
                opened: false,
              }))
            }
          },
          text:
            confirmDeletionModalStage.stage === 1
              ? t('common.no')
              : t('common.yes'),
        }}
        closeButton={{
          callback: () => {
            if (confirmDeletionModalStage.stage === 1) {
              setConfirmDeletionModalStage((prevState) => ({
                ...prevState,
                stage: 2,
              }))
            }
            if (confirmDeletionModalStage.stage === 2) {
              setConfirmDeletionModalStage((prevState) => ({
                ...prevState,
                opened: false,
              }))
              handleDeletion()
            }
          },
          text:
            confirmDeletionModalStage.stage === 1
              ? t('common.yes')
              : t('common.no'),
        }}
        style="fitted"
        switchButtons={confirmDeletionModalStage.stage === 2}
      >
        <Typography
          sx={{
            marginBottom: '16px',
          }}
        >
          {confirmDeletionModalStage.stage === 1
            ? t('volume_overview.delete_volume_text')
            : t('volume_overview.delete_volume_text2')}
        </Typography>
      </ModalContainer>
      <ModalContainer
        header={t('specimens_overview.volume_overview_modal_link')}
        opened={volumeStatsModalOpened}
        onClose={() => setVolumeStatsModalOpened(false)}
        closeButton={{ callback: () => setVolumeStatsModalOpened(false) }}
      >
        <VolumeOverviewStatsModal volumeId={volumeId} />
      </ModalContainer>
      <ModalContainer
        header={t('volume_overview.unsaved_changes')}
        opened={blocker.state === 'blocked'}
        onClose={() => blocker.reset?.()}
        closeButton={{
          callback: () => blocker.reset?.(),
          text: t('common.no'),
        }}
        acceptButton={{
          callback: () => blocker.proceed?.(),
          text: t('common.yes'),
        }}
        style="fitted"
      >
        <Typography
          sx={{
            marginBottom: '16px',
          }}
        >
          {t('volume_overview.unsaved_changes_text')}
        </Typography>
      </ModalContainer>
    </Box>
  )
}

export default VolumeManagement
