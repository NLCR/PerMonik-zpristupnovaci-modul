import { useTranslation } from 'react-i18next'
import React, { FC, useState } from 'react'
import dayjs from 'dayjs'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material-pigment-css/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import { DatePicker } from '@mui/x-date-pickers'
import { useLanguageCode } from '../../../utils/helperHooks'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { TMe } from '../../../schema/user'
import { TMutation } from '../../../schema/mutation'
import { TOwner } from '../../../schema/owner'
import { TPublication } from '../../../schema/publication'
import { TMetaTitle } from '../../../schema/metaTitle'
import PublicationMarkSelectorModal from './editCells/PublicationMarkSelectorModal'
import Periodicity from './Periodicity'

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
                  volumeActions.setMetaTitleId(event.target.value)
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
      <FormControlLabel
        sx={{
          // display: 'flex',
          width: '100%',
          // justifyContent: 'space-between',
          // alignItems: 'start',
          // fontSize: '12px',
        }}
        control={
          <Checkbox
            checked={volumeState.showAttachmentsAtTheEnd}
            onChange={(event) =>
              volumeActions.setShowAttachmentsAtTheEnd(event.target.checked)
            }
            disabled={!canEdit}
            sx={{
              // marginTop: 1,
              // marginBottom: 1,
              cursor: 'pointer',
              // width: '100%',
            }}
          />
        }
        label={t('volume_overview.show_attachments_at_the_end')}
      />
      <Periodicity canEdit={canEdit} publications={publications} />
    </Box>
  )
}

export default InputData
