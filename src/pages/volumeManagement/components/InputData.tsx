import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'
import dayjs from 'dayjs'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import { DatePicker } from '@mui/x-date-pickers-pro'
import { useLanguageCode } from '../../../utils/helperHooks'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TMe } from '../../../schema/user'
import { TMutation } from '../../../schema/mutation'
import { TOwner } from '../../../schema/owner'
import { TPublication } from '../../../schema/publication'
import { TMetaTitle } from '../../../schema/metaTitle'
import PublicationMarkSelectorModal from './editCells/PublicationMarkSelectorModal'
import Periodicity from './Periodicity'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import Typography from '@mui/material/Typography'
import { blue } from '@mui/material/colors'
import VolumeOverviewStatsModal from '../../specimensOverview/components/VolumeOverviewStatsModal'
import Button from '@mui/material/Button'

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

interface InputDataProps {
  canEdit: boolean
  me: TMe
  mutations: TMutation[]
  owners: TOwner[]
  publications: TPublication[]
  metaTitles: TMetaTitle[]
}

const InputData: FC<InputDataProps> = ({
  canEdit,
  me,
  mutations,
  owners,
  publications,
  metaTitles,
}) => {
  const { t } = useTranslation()
  const { languageCode } = useLanguageCode()

  const [publicationMarksModalOpened, setPublicationMarksModalOpened] =
    useState(false)
  const [volumeStatsModalOpened, setVolumeStatsModalOpened] = useState(false)

  const volumeState = useVolumeManagementStore((state) => state.volumeState)
  const volumeActions = useVolumeManagementStore((state) => state.volumeActions)

  return (
    <Box>
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
              <Select
                variant="outlined"
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.metaTitleId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setMetaTitle(
                    event.target.value,
                    metaTitles.find((m) => m.id === event.target.value)?.name ||
                      ''
                  )
                }
              >
                {metaTitles.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.name}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.mutation')}</TableCell>
            <TableCell>
              <Select
                variant="outlined"
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.mutationId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setMutationId(event.target.value)
                }
              >
                {mutations.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    {o.name[languageCode]}
                  </MenuItem>
                ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.publication_mark')}</TableCell>
            <TableCell>
              <TextField
                disabled={!canEdit}
                value={volumeState.publicationMark}
                size="small"
                onClick={() => setPublicationMarksModalOpened(true)}
              />
              {publicationMarksModalOpened ? (
                <PublicationMarkSelectorModal
                  row={volumeState}
                  open={publicationMarksModalOpened}
                  onClose={() => setPublicationMarksModalOpened(false)}
                  onSave={(data) =>
                    volumeActions.setPublicationMark(data.publicationMark)
                  }
                />
              ) : null}
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.bar_code')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.barCode}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setBarCode(event.target.value)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.signature')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.signature}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setSignature(event.target.value)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.year')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.year}
                disabled={!canEdit}
                onChange={(event) => volumeActions.setYear(event.target.value)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.date_from')}</TableCell>
            <TableCell>
              <DatePicker
                disabled={!canEdit}
                value={dayjs(volumeState.dateFrom)}
                onChange={(value) => volumeActions.setDateFrom(value)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.date_to')}</TableCell>
            <TableCell>
              <DatePicker
                disabled={!canEdit}
                value={dayjs(volumeState.dateTo)}
                minDate={
                  dayjs(volumeState.dateFrom).isValid()
                    ? dayjs(volumeState.dateFrom)
                    : undefined
                }
                onChange={(value) => volumeActions.setDateTo(value)}
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.first_number')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.firstNumber}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setFirstNumber(event.target.value)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.last_number')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.lastNumber}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setLastNumber(event.target.value)
                }
              />
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.owner')}</TableCell>
            <TableCell>
              <Select
                variant="outlined"
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.ownerId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setOwnerId(event.target.value)
                }
              >
                {me.role === 'super_admin'
                  ? owners.map((o) => (
                      <MenuItem key={o.id} value={o.id}>
                        {o.name}
                      </MenuItem>
                    ))
                  : owners
                      .filter((o) => me.owners?.includes(o.id))
                      .map((o) => (
                        <MenuItem key={o.id} value={o.id}>
                          {o.name}
                        </MenuItem>
                      ))}
              </Select>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableCell>{t('volume_overview.note')}</TableCell>
            <TableCell>
              <TextField
                size="small"
                value={volumeState.note}
                disabled={!canEdit}
                onChange={(event) => volumeActions.setNote(event.target.value)}
              />
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '16px',
        }}
      >
        <Periodicity canEdit={canEdit} publications={publications} />
        {volumeStatsModalOpened ? (
          <Modal
            open={volumeStatsModalOpened}
            onClose={() => {
              setVolumeStatsModalOpened(false)
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
            <Fade in={volumeStatsModalOpened}>
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
                <VolumeOverviewStatsModal volumeBarCode={volumeState.id} />
              </Box>
            </Fade>
          </Modal>
        ) : null}
        <Button
          variant="contained"
          onClick={() => setVolumeStatsModalOpened(true)}
        >
          {t('specimens_overview.volume_overview_modal_link')}
        </Button>
      </Box>
    </Box>
  )
}

export default InputData
