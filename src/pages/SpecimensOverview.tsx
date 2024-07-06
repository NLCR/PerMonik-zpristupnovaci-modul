import {
  ActionIcon,
  Box,
  Button,
  createStyles,
  Flex,
  Image,
  LoadingOverlay,
  rem,
  Tabs,
  Text,
} from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { Suspense, useEffect, useState } from 'react'
import {
  IconCalendarSearch,
  IconChevronLeft,
  IconChevronRight,
  IconHelp,
  IconTableRow,
} from '@tabler/icons-react'
import dayjs from 'dayjs'
import { modals } from '@mantine/modals'
import { useMetaTitleQuery } from '../api/metaTitle'
import {
  useSpecimenListQuery,
  useSpecimensStartDateForCalendar,
  useSpecimenFacetsQuery,
} from '../api/specimen'
import Loader from '../components/reusableComponents/Loader'
import ShowError from '../components/reusableComponents/ShowError'
import ShowInfoMessage from '../components/reusableComponents/ShowInfoMessage'
import { useSpecimensOverviewStore } from '../slices/useSpecimensOverviewStore'
import SpecimenDayDetailExampleImage from '../assets/images/specimen-day-detail-example.png'

const Facets = React.lazy(
  () => import('../components/specimensOverview/Facets')
)
const Table = React.lazy(() => import('../components/specimensOverview/Table'))
const Calendar = React.lazy(
  () => import('../components/specimensOverview/Calendar')
)

const useStyles = createStyles((theme) => ({
  flexWrapper: {
    gap: theme.spacing.md,
    height: '100%',
    maxHeight: '80vh',
    position: 'relative',
  },
  facets: {
    // width: '20%',
    width: rem(280),
    // color: theme.colors.dark[9],
    padding: theme.spacing.md,
    backgroundColor: 'white',
    textAlign: 'left',
    borderRadius: theme.spacing.xs,
    boxShadow: theme.shadows.xs,
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
  },
  viewWrapper: {
    width: '100%',
    paddingLeft: theme.spacing.md,
    paddingRight: theme.spacing.md,
    backgroundColor: 'white',
    borderRadius: theme.spacing.xs,
    boxShadow: theme.shadows.xs,
    flexDirection: 'column',
    overflow: 'hidden',
  },
  facetCheckboxLabelWrapper: {
    width: '100%',
  },
}))

const SpecimensOverview = () => {
  const { metaTitleId } = useParams()
  const { classes } = useStyles()
  const { t } = useTranslation()
  const [showOverlay, setShowOverlay] = useState(false)
  const {
    resetAll,
    calendarMinDate,
    setCalendarDate,
    setCalendarMinDate,
    calendarDate,
    view,
    setView,
  } = useSpecimensOverviewStore()

  const {
    data: metaTitle,
    isLoading: metaTitleLoading,
    isError: metaTitleError,
  } = useMetaTitleQuery(metaTitleId as string)

  const metaTitleEnabled = Boolean(metaTitle)

  const {
    data: calendarDateFromQuery,
    isLoading: calendarDateLoading,
    isError: calendarDateError,
  } = useSpecimensStartDateForCalendar(metaTitleId as string, metaTitleEnabled)
  const {
    data: specimens,
    isLoading: specimensLoading,
    isError: specimensError,
    isRefetching: specimensRefetching,
  } = useSpecimenListQuery(metaTitleId as string, metaTitleEnabled)

  const {
    data: facets,
    isLoading: facetsLoading,
    isError: facetsError,
    isRefetching: facetsRefething,
  } = useSpecimenFacetsQuery(metaTitleId as string, metaTitleEnabled)

  useEffect(() => {
    resetAll()
  }, [resetAll])

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (specimensRefetching || facetsRefething) {
      setShowOverlay(true)
    } else {
      timer = setTimeout(() => {
        setShowOverlay(false)
      }, 150)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [facetsRefething, specimensRefetching])

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

  let showedDate
  if (calendarDate) {
    showedDate = dayjs(calendarDate).format('MMMM YYYY')
  }

  return (
    <Flex className={classes.flexWrapper}>
      <LoadingOverlay
        visible={showOverlay}
        loader={<Loader />}
        overlayBlur={1}
        transitionDuration={100}
      />
      <Box className={classes.facets}>
        {specimens && facets && metaTitle ? (
          <Suspense fallback={<Loader />}>
            <Facets
              facets={facets}
              specimens={specimens.specimens}
              metaTitleName={metaTitle.name}
              publicationDayMax={specimens.publicationDayMax}
              publicationDayMin={specimens.publicationDayMin}
              specimensRefetching={false}
              // specimensRefetching={specimensRefetching}
            />
          </Suspense>
        ) : null}
      </Box>
      <Flex className={classes.viewWrapper}>
        <Flex
          justify="space-between"
          align="center"
          sx={{
            marginTop: rem(10),
          }}
        >
          <Flex justify="flex-start" align="center">
            <Tabs
              value={view}
              onTabChange={setView}
              sx={{
                width: 'fit-content',
              }}
            >
              <Tabs.List>
                <Tabs.Tab
                  value="calendar"
                  icon={<IconCalendarSearch size="0.8rem" />}
                >
                  {t('specimens_overview.calendar')}
                </Tabs.Tab>
                <Tabs.Tab
                  // disabled
                  value="table"
                  icon={<IconTableRow size="0.8rem" />}
                >
                  {t('specimens_overview.table')}
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Flex
              sx={(theme) => ({
                marginLeft: rem(20),
                fontSize: theme.fontSizes.sm,
                color: theme.colors.blue[9],
                fontWeight: 'bolder',
                alignItems: 'center',
              })}
            >
              {showedDate && view === 'calendar' ? (
                <>
                  <Text
                    sx={{
                      marginRight: rem(20),
                    }}
                  >
                    {t('specimens_overview.showed_month')}:{' '}
                  </Text>
                  <Flex
                    sx={{
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      width: rem(220),
                    }}
                  >
                    <ActionIcon
                      variant="outline"
                      sx={{
                        marginTop: rem(2),
                      }}
                      disabled={
                        dayjs(calendarDate).diff(
                          dayjs(calendarMinDate),
                          'month'
                        ) <= 0
                      }
                      onClick={() => {
                        setCalendarDate(
                          dayjs(calendarDate).subtract(1, 'month').toDate()
                        )
                      }}
                    >
                      <IconChevronLeft size="1rem" />
                    </ActionIcon>{' '}
                    <Text
                      sx={{
                        marginLeft: rem(10),
                        marginRight: rem(10),
                      }}
                    >
                      {showedDate}
                    </Text>
                    <ActionIcon
                      variant="outline"
                      sx={{
                        marginTop: rem(2),
                      }}
                      onClick={() => {
                        setCalendarDate(
                          dayjs(calendarDate).add(1, 'month').toDate()
                        )
                      }}
                    >
                      <IconChevronRight size="1rem" />
                    </ActionIcon>
                  </Flex>
                </>
              ) : null}
            </Flex>
          </Flex>
          {/* eslint-disable-next-line no-nested-ternary */}
          {view === 'calendar' ? (
            <Button
              leftIcon={<IconHelp />}
              onClick={() => {
                modals.open({
                  centered: true,
                  size: 'auto',
                  title: (
                    <Text
                      sx={(theme) => ({
                        color: theme.colors.blue[9],
                        fontSize: theme.fontSizes.xl,
                        fontWeight: 'bold',
                      })}
                    >
                      {t('specimens_overview.help')}
                    </Text>
                  ),
                  children: (
                    <>
                      <Text mb={5} fw="bolder">
                        {t('specimens_overview.help_desc_1')}
                      </Text>
                      <Text mb={5}>{t('specimens_overview.help_desc_2')}</Text>
                      <Image
                        src={SpecimenDayDetailExampleImage}
                        width={200}
                        mb={20}
                      />
                      {/* <Text size="sm"> */}
                      {/*  {t('specimens_overview.help_desc_3')} */}
                      {/* </Text> */}
                    </>
                  ),
                })
              }}
            >
              {t('specimens_overview.help')}
            </Button>
          ) : null}
        </Flex>
        {specimens?.specimens.length && metaTitle ? (
          <Suspense fallback={<Loader />}>
            {view === 'calendar' ? (
              <Calendar specimens={specimens.specimens} metaTitle={metaTitle} />
            ) : (
              <Table
                count={specimens.count}
                specimens={specimens.specimens}
                specimensRefetching={false}
                // specimensRefetching={specimensRefetching}
              />
            )}
          </Suspense>
        ) : null}
        {metaTitleLoading ||
        ((specimensLoading || calendarDateLoading || facetsLoading) &&
          metaTitleEnabled) ? (
          <Loader />
        ) : null}
        {metaTitleError ||
        specimensError ||
        calendarDateError ||
        facetsError ? (
          <ShowError />
        ) : null}
        {!metaTitle && !metaTitleLoading && !metaTitleError ? (
          <ShowInfoMessage
            message={t('specimens_overview.meta_title_not_found')}
          />
        ) : null}
        {!specimens?.specimens.length &&
        !specimensLoading &&
        !specimensError &&
        metaTitle ? (
          <ShowInfoMessage
            message={t('specimens_overview.specimens_not_found')}
          />
        ) : null}
      </Flex>
    </Flex>
  )
}

export default SpecimensOverview
