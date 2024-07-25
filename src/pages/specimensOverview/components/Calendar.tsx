import {
  Backdrop,
  Box,
  Fade,
  Typography,
  Modal,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from '@mui/material'
import React, { FC, useEffect, useState } from 'react'
import { flow, groupBy, map, sortBy } from 'lodash-es'
import dayjs from 'dayjs'
import { useTranslation } from 'react-i18next'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import DriveFileMoveOutlinedIcon from '@mui/icons-material/DriveFileMoveOutlined'
import { Link as ReactLink } from 'react-router-dom'
import { TSpecimen } from '../../../schema/specimen'
import { useSpecimensOverviewStore } from '../../../slices/useSpecimensOverviewStore'
import { TMetaTitle } from '../../../schema/metaTitle'
import { getFirstMondayOfMonth } from '../../../utils/helperFunctions'
import ShowInfoMessage from '../../../components/ShowInfoMessage'
import { useMutationListQuery } from '../../../api/mutation'
import { useLanguageCode } from '../../../utils/helperHooks'
import Loader from '../../../components/Loader'
import {
  useSpecimenListQuery,
  useSpecimensStartDateForCalendar,
} from '../../../api/specimen'
import ShowError from '../../../components/ShowError'
import VolumeOverviewStatsModal from './VolumeOverviewStatsModal'
import { usePublicationListQuery } from '../../../api/publication'
import { useOwnerListQuery } from '../../../api/owner'

const mainModalStyle = {
  overflowY: 'scroll',
  position: 'absolute' as const,
  maxHeight: '600px',
  height: '80vh',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '1200px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

const subModalStyle = {
  overflowY: 'scroll',
  position: 'absolute' as const,
  maxHeight: '800px',
  height: '80vh',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90vw',
  maxWidth: '1000px',
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
}

type TProps = {
  metaTitle: TMetaTitle
}

type TSpecimensDay = {
  day: string
  isPreviousMonth: boolean
  specimens: TSpecimen[][]
}[]

const Calendar: FC<TProps> = ({ metaTitle }) => {
  const { t, i18n } = useTranslation()
  const { calendarDate, setCalendarDate, calendarMinDate, setCalendarMinDate } =
    useSpecimensOverviewStore()
  const { data: mutations } = useMutationListQuery()
  const { data: publications } = usePublicationListQuery()
  const { data: owners } = useOwnerListQuery()
  const { languageCode } = useLanguageCode()
  const [mainModalOpened, setMainModalOpened] = useState(false)
  const [mainModalData, setMainModalData] = useState<{
    data: TSpecimen[]
    day: string
  } | null>(null)
  const [subModalOpened, setSubModalOpened] = useState(false)
  const [subModalData, setSubModalData] = useState<TSpecimen | null>(null)

  const {
    data: calendarDateFromQuery,
    isFetching: calendarStartDateFetcing,
    isError: calendarStartDateError,
  } = useSpecimensStartDateForCalendar(metaTitle.id)
  const {
    data: specimens,
    isFetching: specimensFetching,
    isError: specimensError,
  } = useSpecimenListQuery(metaTitle.id)

  useEffect(() => {
    if (calendarDateFromQuery && !calendarMinDate) {
      setCalendarMinDate(dayjs(calendarDateFromQuery.toString()).toDate())
      setCalendarDate(dayjs(calendarDateFromQuery.toString()).toDate())
    }
  }, [
    calendarDateFromQuery,
    setCalendarMinDate,
    calendarMinDate,
    setCalendarDate,
  ])

  if (calendarStartDateFetcing || specimensFetching) {
    return <Loader />
  }

  if (calendarStartDateError || specimensError) {
    return <ShowError />
  }

  const monday = getFirstMondayOfMonth(calendarDate)
  const dayJs = dayjs(calendarDate)
  const daysInMonth = dayJs.daysInMonth()
  const daysArray: string[] = []
  for (let i = 1; i <= daysInMonth; i += 1) {
    daysArray.push(dayJs.set('date', i).format('YYYY-MM-DD'))
  }

  const groupedSpecimensByDay = flow(
    (rawSpecimens: TSpecimen[]) =>
      groupBy(rawSpecimens, (s) => s.publicationDate),
    (groupedSpecimens) =>
      map(groupedSpecimens, (value, key) => ({ day: key, specimens: value }))
  )(specimens?.specimens || [])

  const specimensInDay: TSpecimensDay = []

  daysArray.forEach((day) => {
    const found = groupedSpecimensByDay.find((group) => group.day === day)
    if (found) {
      const groupedBySameAttributes = Object.values(
        sortBy(
          groupBy(
            found.specimens,
            (obj) => `${obj.mutationId}_${obj.publicationMark}_${obj.number}`
          ),
          (obj) => obj.map((o) => `${o.mutationId}_${o.publicationMark}`)
        )
      )
      specimensInDay.push({
        day,
        isPreviousMonth: false,
        specimens: groupedBySameAttributes,
      })
    } else {
      specimensInDay.push({ day, isPreviousMonth: false, specimens: [] })
    }
  })

  if (monday) {
    const daysToPreviousMonth = monday.get('D') - 7
    const startOfMonth = dayjs(calendarDate).date(1)
    if (daysToPreviousMonth <= 0 && daysToPreviousMonth > -6) {
      const missingDaysOfPreviousMonth: TSpecimensDay = []
      for (let i = daysToPreviousMonth; i <= 0; i += 1) {
        missingDaysOfPreviousMonth.push({
          day: startOfMonth.date(i).format('YYYY-MM-DD'),
          isPreviousMonth: true,
          specimens: [],
        })
      }
      specimensInDay.unshift(...missingDaysOfPreviousMonth)
    }
  }

  if (!specimensInDay.some((sid) => sid.specimens.length)) {
    return (
      <ShowInfoMessage message={t('specimens_overview.specimens_not_found')} />
    )
  }

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, minmax(0, 1fr))',
        marginTop: '16px',
        marginBottom: '16px',
        height: '100%',
        // overflowY: 'auto',
      }}
    >
      <Modal
        open={mainModalOpened}
        onClose={() => {
          setMainModalOpened(false)
          setMainModalData(null)
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
        <Fade in={mainModalOpened}>
          <Box sx={mainModalStyle}>
            <Typography
              sx={(theme) => ({
                color: theme.palette.blue['900'],
                fontSize: '24px',
                fontWeight: 'bold',
              })}
            >
              {metaTitle.name}
            </Typography>
            {/* {dayjs(day.day).format('dddd DD.MM.YYYY')} */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: '700',
                }}
              >
                {t('specimens_overview.date')}
              </Typography>
              <Typography
                sx={{
                  marginBottom: '20px',
                }}
              >
                {dayjs(mainModalData?.day).format('dddd DD.MM.YYYY')}
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: '700',
                }}
              >
                {t('specimens_overview.specimens')}
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>{t('specimens_overview.mutation')}</TableCell>
                    <TableCell>{t('specimens_overview.publication')}</TableCell>
                    <TableCell>{t('specimens_overview.name')}</TableCell>
                    <TableCell>{t('specimens_overview.sub_name')}</TableCell>
                    <TableCell>{t('specimens_overview.owner')}</TableCell>
                    <TableCell>
                      {t('specimens_overview.digitization')}
                    </TableCell>
                    <TableCell>
                      {t('specimens_overview.volume_overview_modal_link')}
                    </TableCell>
                    <TableCell>
                      {t('specimens_overview.volume_detail_link')}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mainModalData?.data.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        {
                          mutations?.find((m) => m.id === s.mutationId)?.name[
                            languageCode
                          ]
                        }
                      </TableCell>
                      <TableCell>
                        {
                          publications?.find((p) => p.id === s.publicationId)
                            ?.name[languageCode]
                        }
                      </TableCell>
                      <TableCell>{s.name}</TableCell>
                      <TableCell
                        sx={{
                          maxWidth: '300px',
                        }}
                      >
                        {s.subName}
                      </TableCell>
                      <TableCell>
                        <Typography
                          component="a"
                          href={`https://www.knihovny.cz/Search/Results?lookfor=${s.barCode}&type=AllFields&limit=20`}
                          target="_blank"
                          rel="noreferrer"
                          sx={(theme) => ({
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            color: theme.palette.blue['500'],
                            transition: 'color 0.1s',
                            ':hover': {
                              color: theme.palette.blue['900'],
                            },
                          })}
                        >
                          {owners?.find((o) => o.id === s.ownerId)?.name}{' '}
                          <OpenInNewIcon
                            sx={{
                              marginLeft: '3px',
                            }}
                          />
                        </Typography>
                      </TableCell>
                      <TableCell />
                      <TableCell>
                        <Typography
                          sx={(theme) => ({
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            color: theme.palette.blue['500'],
                            transition: 'color 0.1s',
                            ':hover': {
                              color: theme.palette.blue['900'],
                            },
                          })}
                          onClick={() => {
                            setSubModalOpened(true)
                            setSubModalData(s)
                          }}
                        >
                          {t('specimens_overview.open')}
                          <DriveFileMoveOutlinedIcon
                            sx={{
                              marginLeft: '3px',
                            }}
                          />
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography
                          component={ReactLink}
                          sx={(theme) => ({
                            cursor: 'pointer',
                            textDecoration: 'none',
                            display: 'flex',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            color: theme.palette.blue['500'],
                            transition: 'color 0.1s',
                            ':hover': {
                              color: theme.palette.blue['900'],
                            },
                          })}
                          to={`/${i18n.resolvedLanguage}/${t('urls.volume_overview')}/${
                            s.volumeId
                          }`}
                        >
                          {s.barCode}{' '}
                          <DriveFileMoveOutlinedIcon
                            sx={{
                              marginLeft: '3px',
                            }}
                          />
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
            {/* <CalendarModal row={row} day={day.day} /> */}
          </Box>
        </Fade>
      </Modal>
      <Modal
        open={subModalOpened}
        onClose={() => {
          setSubModalOpened(false)
          setSubModalData(null)
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
        <Fade in={subModalOpened}>
          <Box sx={subModalStyle}>
            <Typography
              sx={(theme) => ({
                color: theme.palette.blue['900'],
                fontSize: '24px',
                fontWeight: 'bold',
              })}
            >
              {t('specimens_overview.volume_overview_modal_link')}{' '}
              {subModalData?.barCode}
            </Typography>
            <VolumeOverviewStatsModal volumeBarCode={subModalData?.volumeId} />
          </Box>
        </Fade>
      </Modal>
      {specimensInDay.map((day) => (
        <Box
          key={day.day}
          sx={(theme) => ({
            backgroundColor: day.isPreviousMonth
              ? theme.palette.grey['400']
              : theme.palette.grey['100'],
            border: `2px solid white`,
            borderRadius: '4px',
            paddingTop: '4px',
            paddingLeft: '8px',
            paddingRight: '8px',
            paddingBottom: '8px',
          })}
        >
          <Typography variant="body2">
            <Typography
              sx={(theme) => ({
                color: theme.palette.blue['900'],
                marginBottom: '4px',
              })}
            >
              {dayjs(day.day).format('dd DD')}
            </Typography>
            {/* specimens grouped by same values and displayed on one line (when clicked, individual specimens are shown) */}
            {day.specimens.map((row) => {
              const firstInRow = row.find(Boolean)
              if (firstInRow) {
                return (
                  <Box
                    key={firstInRow.id}
                    sx={(theme) => ({
                      display: 'flex',
                      marginTop: '2px',
                      marginBottom: '2px',
                      padding: '2px 8px',
                      backgroundColor: theme.palette.grey['800'],
                      borderRadius: '4px',
                      color: theme.palette.grey['100'],
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '13px',
                      cursor: 'pointer',
                    })}
                    onClick={() => {
                      setMainModalOpened(true)
                      setMainModalData({ data: row, day: day.day })
                    }}
                  >
                    <Typography variant="body2">
                      {firstInRow.number}{' '}
                      {
                        mutations?.find((m) => m.id === firstInRow.mutationId)
                          ?.name[languageCode]
                      }{' '}
                      {firstInRow.publicationMark.length
                        ? firstInRow.publicationMark
                        : t('specimens_overview.without_mark')}
                    </Typography>
                    <Box
                      sx={(theme) => ({
                        display: 'flex',
                        backgroundColor: theme.palette.grey['100'],
                        borderRadius: '50%',
                        color: theme.palette.grey['900'],
                        width: '16px',
                        height: '16px',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      })}
                    >
                      {row.length}
                    </Box>
                  </Box>
                )
              }
              return null
            })}
          </Typography>
        </Box>
      ))}
    </Box>
  )
}

export default Calendar
