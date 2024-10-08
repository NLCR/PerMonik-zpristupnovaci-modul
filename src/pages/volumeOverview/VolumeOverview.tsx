import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Table from '@mui/material/Table'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import TableBody from '@mui/material/TableBody'
import dayjs from 'dayjs'
import { blue } from '@mui/material/colors'
import { usePublicVolumeDetailQuery } from '../../api/volume'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import ShowInfoMessage from '../../components/ShowInfoMessage'
import { useLanguageCode } from '../../utils/helperHooks'
import { useMutationListQuery } from '../../api/mutation'
import { useOwnerListQuery } from '../../api/owner'
import SpecimensTable from './components/Table'
import { useMetaTitleListQuery } from '../../api/metaTitle'
import Button from '@mui/material/Button'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import VolumeOverviewStatsModal from '../specimensOverview/components/VolumeOverviewStatsModal'
import Modal from '@mui/material/Modal'
import React, { useState } from 'react'

const modalStyle = {
  overflowY: 'auto',
  position: 'absolute' as const,
  maxHeight: '800px',
  height: '80vh',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '1000px',
  bgcolor: 'background.paper',
  borderRadius: '4px',
  boxShadow: 24,
  p: 4,
}

const VolumeOverview = () => {
  const { volumeId } = useParams()
  const { t } = useTranslation()

  const [modalOpened, setModalOpened] = useState(false)

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
  const { languageCode } = useLanguageCode()
  const {
    data: volume,
    isLoading: volumeLoading,
    isError: volumeError,
  } = usePublicVolumeDetailQuery(volumeId)
  const {
    data: metaTitles,
    isLoading: metaTitlesLoading,
    isError: metaTitlesError,
  } = useMetaTitleListQuery()

  if (volumeLoading || mutationsLoading || ownersLoading || metaTitlesLoading)
    return <Loader />
  if (volumeError || mutationsError || ownersError || metaTitlesError)
    return <ShowError />
  if (!volume || !mutations || !owners || !metaTitles)
    return <ShowInfoMessage message={t('volume_overview.not_found')} />

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
          sx={{
            marginBottom: '8px',
            color: blue['900'],
            fontWeight: 'bold',
            fontSize: '24px',
          }}
        >
          {t('volume_overview.volume_information')}
        </Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>{t('volume_overview.name')}</TableCell>
              <TableCell>{t('volume_overview.value')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>{t('volume_overview.meta_title')}</TableCell>
              <TableCell>
                {
                  metaTitles.find((m) => m.id === volume.volume.metaTitleId)
                    ?.name
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.mutation')}</TableCell>
              <TableCell>
                {
                  mutations.find((m) => m.id === volume.volume.mutationId)
                    ?.name[languageCode]
                }
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.publication_mark')}</TableCell>
              <TableCell>{volume.volume.publicationMark}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.bar_code')}</TableCell>
              <TableCell>{volume.volume.barCode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.signature')}</TableCell>
              <TableCell>{volume.volume.signature}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.year')}</TableCell>
              <TableCell>{volume.volume.year}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.date_from')}</TableCell>
              <TableCell>
                {dayjs(volume.volume.dateFrom).format('DD. MMMM YYYY')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.date_to')}</TableCell>
              <TableCell>
                {dayjs(volume.volume.dateTo).format('DD. MMMM YYYY')}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.first_number')}</TableCell>
              <TableCell>{volume.volume.firstNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.last_number')}</TableCell>
              <TableCell>{volume.volume.lastNumber}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.owner')}</TableCell>
              <TableCell>
                {owners.find((o) => o.id === volume.volume.ownerId)?.name}
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell>{t('volume_overview.note')}</TableCell>
              <TableCell>{volume.volume.note}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        <Modal
          open={modalOpened}
          onClose={() => {
            setModalOpened(false)
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
          <Fade in={modalOpened}>
            <Box sx={modalStyle}>
              <Typography
                sx={{
                  color: blue['900'],
                  fontSize: '24px',
                  fontWeight: 'bold',
                  marginBottom: '16px',
                }}
              >
                {t('specimens_overview.volume_overview_modal_link')}{' '}
              </Typography>
              <VolumeOverviewStatsModal volumeBarCode={volumeId} />
            </Box>
          </Fade>
        </Modal>
        <Button
          sx={{
            marginTop: '10px',
          }}
          variant="contained"
          onClick={() => setModalOpened(true)}
        >
          {t('specimens_overview.volume_overview_modal_link')}
        </Button>
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
        <SpecimensTable volume={volume} />
      </Box>
    </Box>
  )
}

export default VolumeOverview
