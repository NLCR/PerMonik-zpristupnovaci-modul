import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'
import dayjs from 'dayjs'
import {
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Box,
  MenuItem,
  Select,
  TextField,
  Button,
  Backdrop,
  Fade,
  Typography,
  Modal,
  useTheme,
} from '@mui/material'
import { DatePicker } from '@mui/x-date-pickers'
import { useLanguageCode } from '../../../utils/helperHooks'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TUser } from '../../../schema/user'
import { TMutation } from '../../../schema/mutation'
import { TOwner } from '../../../schema/owner'
import { TPublication } from '../../../schema/publication'
import { TMetaTitle } from '../../../schema/metaTitle'
import PublicationMarkSelectorModal from '../../specimensOverview/components/PublicationMarkSelectorModal'

const mainModalStyle = {
  overflowY: 'auto',
  position: 'absolute' as const,
  maxHeight: '600px',
  height: '80vh',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '1200px',
  borderRadius: '4px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

interface InputDataProps {
  canEdit: boolean
  me: TUser
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
  const theme = useTheme()

  const [publicationMarksModalOpened, setPublicationMarksModalOpened] =
    useState(false)
  const [periodicityModalVisible, setPeriodicityModalVisible] = useState(false)

  const volumeState = useVolumeManagementStore((state) => state.volumeState)
  const volumeActions = useVolumeManagementStore((state) => state.volumeActions)
  const volumePeriodicityActions = useVolumeManagementStore(
    (state) => state.volumePeriodicityActions
  )

  return (
    <Box>
      {periodicityModalVisible ? (
        <Modal
          open={periodicityModalVisible}
          onClose={() => {
            setPeriodicityModalVisible(false)
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
          <Fade in={periodicityModalVisible}>
            <Box sx={mainModalStyle}>
              <Typography
                variant="h5"
                sx={{
                  marginBottom: '8px',
                  color: theme.palette.blue['900'],
                }}
              >
                {t('volume_overview.periodicity')}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('volume_overview.releasing')}</TableCell>
                    <TableCell>{t('volume_overview.is_in_volume')}</TableCell>
                    <TableCell>{t('volume_overview.publication')}</TableCell>
                    <TableCell>{t('volume_overview.pages_count')}</TableCell>
                    <TableCell>{t('volume_overview.name')}</TableCell>
                    <TableCell>{t('volume_overview.sub_name')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {volumeState.periodicity.map((p, index) => (
                    <TableRow key={p.day}>
                      <TableCell>
                        {t(`volume_overview.days.${p.day}`)}
                      </TableCell>
                      <TableCell>
                        <Checkbox
                          size="small"
                          checked={p.active}
                          onChange={(event) =>
                            volumePeriodicityActions.setActive(
                              event.target.checked,
                              index
                            )
                          }
                          disabled={!canEdit}
                          sx={{
                            // marginTop: 1,
                            // marginBottom: 1,
                            cursor: 'pointer',
                            // width: '100%',
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Select
                          size="small"
                          sx={{
                            minWidth: '218px',
                          }}
                          value={p.publication}
                          disabled={!canEdit}
                          onChange={(event) =>
                            volumePeriodicityActions.setPublicationId(
                              event.target.value,
                              index
                            )
                          }
                        >
                          {publications.map((o) => (
                            <MenuItem key={o.id} value={o.id}>
                              {o.name[languageCode]}
                            </MenuItem>
                          ))}
                        </Select>
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={p.pagesCount}
                          disabled={!canEdit}
                          onChange={(event) =>
                            volumePeriodicityActions.setPagesCount(
                              event.target.value,
                              index
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={p.name}
                          disabled={!canEdit}
                          onChange={(event) =>
                            volumePeriodicityActions.setName(
                              event.target.value,
                              index
                            )
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          size="small"
                          value={p.subName}
                          disabled={!canEdit}
                          onChange={(event) =>
                            volumePeriodicityActions.setSubName(
                              event.target.value,
                              index
                            )
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Fade>
        </Modal>
      ) : null}
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
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.metaTitleId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setMetaTitleId(event.target.value as string)
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
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.mutationId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setMutationId(event.target.value as string)
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
                size="small"
                sx={{
                  minWidth: '218px',
                }}
                value={volumeState.ownerId}
                disabled={!canEdit}
                onChange={(event) =>
                  volumeActions.setOwnerId(event.target.value as string)
                }
              >
                {owners
                  .filter((o) => me.owners.includes(o.id))
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
      <Button
        disabled={!canEdit}
        variant="contained"
        sx={{
          marginTop: '15px',
        }}
        onClick={() => setPeriodicityModalVisible(true)}
      >
        {t('volume_overview.edit_periodicity')}
      </Button>
    </Box>
  )
}

export default InputData
