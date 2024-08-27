/* eslint-disable no-nested-ternary */
import React, { FC, useState } from 'react'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import Backdrop from '@mui/material/Backdrop'
import Fade from '@mui/material/Fade'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import clone from 'lodash/clone'
import dayjs from 'dayjs'
import { blue } from '@mui/material/colors'
import { useVolumeManagementStore } from '../../../slices/useVolumeManagementStore'
import { useLanguageCode } from '../../../utils/helperHooks'
import { TPublication } from '../../../schema/publication'
import { repairVolume, VolumeSchema } from '../../../schema/volume'
import {
  repairOrCreateSpecimen,
  TEditableSpecimen,
} from '../../../schema/specimen'

const mainModalStyle = {
  overflow: 'auto',
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

const getDaysArray = (start: string, end: string): string[] => {
  const arr: string[] = []
  let current = dayjs(start)
  const endDay = dayjs(end)

  while (current.isBefore(endDay) || current.isSame(endDay, 'day')) {
    arr.push(current.format('YYYY-MM-DD'))
    current = current.add(1, 'day')
  }

  return arr
}

const getDayName = (date: string): string => {
  return dayjs(date).format('dddd')
}

interface PeriodicityProps {
  publications: TPublication[]
  canEdit: boolean
}

const Periodicity: FC<PeriodicityProps> = ({ canEdit, publications }) => {
  const [periodicityModalVisible, setPeriodicityModalVisible] = useState(false)
  const { t, i18n } = useTranslation()
  const { languageCode } = useLanguageCode()

  const volumePeriodicityActions = useVolumeManagementStore(
    (state) => state.volumePeriodicityActions
  )
  const specimensActions = useVolumeManagementStore(
    (state) => state.specimensActions
  )
  const volumeState = useVolumeManagementStore((state) => state.volumeState)

  const generateVolume = () => {
    // This ensures that `getDayName` will return english name of day
    dayjs.locale('en')
    const volumeClone = clone(volumeState)

    const repairedVolume = repairVolume(volumeClone, publications)

    const validation = VolumeSchema.safeParse(repairedVolume)

    if (!validation.success) {
      toast.error(t('volume_overview.volume_input_data_validation_error'))
      return
    }

    const dates = getDaysArray(repairedVolume.dateFrom, repairedVolume.dateTo)

    const specimens: TEditableSpecimen[] = []

    let number = repairedVolume.firstNumber
    let attachmentNumber = 1
    let periodicAttachmentNumber = 1
    const defaultPublication = publications.find(
      (publication) => publication.isDefault
    )

    dates.forEach((dt) => {
      const dayStr = getDayName(dt)
      let inserted = false
      repairedVolume.periodicity.forEach((p) => {
        if (p.numExists && p.day === dayStr) {
          const isAttachment = !!publications.find(
            (pub) => pub.id === p.publicationId
          )?.isAttachment
          const isPeriodicAttachment = !!publications.find(
            (pub) => pub.id === p.publicationId
          )?.isPeriodicAttachment

          const specimen = repairOrCreateSpecimen(
            {
              publicationDate: dt,
              publicationDateString: dayjs(dt).format('YYYYMMDD'),
              publicationMark: repairedVolume.publicationMark,
              mutationId: repairedVolume.mutationId,
              numExists: true,
              pagesCount: p.pagesCount,
              name: p.name,
              subName: p.subName,
              publicationId: p.publicationId,
              isAttachment,
              number: !isAttachment ? number.toString() : null,
              attachmentNumber: isAttachment
                ? isPeriodicAttachment
                  ? periodicAttachmentNumber.toString()
                  : attachmentNumber.toString()
                : null,
            },
            repairedVolume
          )

          if (isPeriodicAttachment) {
            periodicAttachmentNumber += 1
          } else if (isAttachment) {
            attachmentNumber += 1
          } else {
            number += 1
          }

          inserted = true

          specimens.push(specimen)
        }
      })

      if (!inserted) {
        const specimen = repairOrCreateSpecimen(
          {
            publicationDate: dt,
            publicationDateString: dayjs(dt).format('YYYYMMDD'),
            publicationMark: repairedVolume.publicationMark,
            mutationId: repairedVolume.mutationId,
            numExists: false,
            publicationId: defaultPublication?.id,
          },
          repairedVolume
        )

        specimens.push(specimen)
      }
    })

    dayjs.locale(i18n.resolvedLanguage)
    specimensActions.setSpecimensState(specimens)
    volumePeriodicityActions.setPeriodicityGenerationUsed(true)
    toast.success(t('volume_overview.specimens_generated_successfully'))
    setPeriodicityModalVisible(false)
  }

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
                  color: blue['900'],
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
                            variant="outlined"
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
              {/* <Typography */}
              {/*  variant="body2" */}
              {/*  sx={{ */}
              {/*    marginTop: '5px', */}
              {/*    textAlign: 'right', */}
              {/*    color: theme.palette.grey['600'], */}
              {/*  }} */}
              {/* > */}
              {/*  {t('volume_overview.changes_are_saved_automatically')} */}
              {/* </Typography> */}
              <Box
                sx={{
                  display: 'flex',
                  gap: '10px',
                  marginTop: '20px',
                }}
              >
                <Button variant="outlined" onClick={() => generateVolume()}>
                  {t('volume_overview.generate_volume')}
                </Button>
                <Button
                  variant="contained"
                  onClick={() => setPeriodicityModalVisible(false)}
                >
                  {t('volume_overview.close')}
                </Button>
              </Box>
            </Box>
          </Fade>
        </Modal>
      ) : null}
    </>
  )
}

export default Periodicity
