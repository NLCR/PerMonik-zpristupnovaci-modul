import React, { FC, useState } from 'react'
import {
  Backdrop,
  Box,
  Button,
  Checkbox,
  Fade,
  MenuItem,
  Modal,
  Select,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { useLanguageCode } from '../../../utils/helperHooks'
import { TPublication } from '../../../schema/publication'

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

interface PeriodicityProps {
  publications: TPublication[]
  canEdit: boolean
}

const Periodicity: FC<PeriodicityProps> = ({ canEdit, publications }) => {
  const [periodicityModalVisible, setPeriodicityModalVisible] = useState(false)
  const theme = useTheme()
  const { t } = useTranslation()
  const { languageCode } = useLanguageCode()

  const volumePeriodicityActions = useVolumeManagementStore(
    (state) => state.volumePeriodicityActions
  )
  const volumeState = useVolumeManagementStore((state) => state.volumeState)

  return (
    <>
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
                  {volumeState.periodicity.map((p, index) => {
                    console.log(p, index)
                    return (
                      <TableRow key={`volume-periodicity-${p.day}`}>
                        <TableCell>
                          {t(`volume_overview.days.${p.day}`)}
                        </TableCell>
                        <TableCell>
                          <Checkbox
                            size="small"
                            checked={p.numExists}
                            onChange={(event) =>
                              volumePeriodicityActions.setNumExists(
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
                            value={p.publicationId}
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
                    )
                  })}
                </TableBody>
              </Table>
            </Box>
          </Fade>
        </Modal>
      ) : null}
    </>
  )
}

export default Periodicity
