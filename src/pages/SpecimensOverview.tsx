import {
  Box,
  createStyles,
  Flex,
  LoadingOverlay,
  rem,
  Tabs,
} from '@mantine/core'
import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import React, { Suspense, useEffect, useState } from 'react'
import { IconCalendarSearch, IconTableRow } from '@tabler/icons-react'
import useMetaTitleQuery from '../api/query/useMetaTitleQuery'
import useSpecimensWithFacetsQuery from '../api/query/useSpecimensWithFacetsQuery'
import Loader from '../components/reusableComponents/Loader'
import ShowError from '../components/reusableComponents/ShowError'
import ShowInfoMessage from '../components/reusableComponents/ShowInfoMessage'
import { useSpecimensOverviewStore } from '../slices/useSpecimensOverviewStore'
import useSpecimensStartDateForCalendar from '../api/query/useSpecimensStartDateForCalendar'
import { createDate } from '../utils/helperFunctions'

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
    width: '20%',
    maxWidth: rem(280),
    // color: theme.colors.dark[9],
    padding: theme.spacing.md,
    backgroundColor: 'white',
    textAlign: 'left',
    borderRadius: theme.spacing.xs,
    boxShadow: theme.shadows.xs,
    display: 'flex',
    flexDirection: 'column',
  },
  viewWrapper: {
    width: '80%',
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
  } = useSpecimensWithFacetsQuery(metaTitleId as string, metaTitleEnabled)

  useEffect(() => {
    resetAll()
  }, [resetAll])

  useEffect(() => {
    let timer: NodeJS.Timer

    if (specimensRefetching) {
      setShowOverlay(true)
    } else {
      timer = setTimeout(() => {
        setShowOverlay(false)
      }, 150)
    }

    return () => {
      clearTimeout(timer)
    }
  }, [specimensRefetching])

  useEffect(() => {
    if (calendarDateFromQuery && !calendarMinDate) {
      setCalendarMinDate(createDate(calendarDateFromQuery.toString()))
      setCalendarDate(createDate(calendarDateFromQuery.toString()))
    }
  }, [
    calendarDateFromQuery,
    setCalendarMinDate,
    calendarMinDate,
    setCalendarDate,
  ])

  return (
    <Flex className={classes.flexWrapper}>
      <LoadingOverlay
        visible={showOverlay}
        loader={<Loader />}
        overlayBlur={1}
        transitionDuration={view === 'table' ? 250 : 100}
      />
      <Box className={classes.facets}>
        {specimens && metaTitle ? (
          <Suspense fallback={<Loader />}>
            <Facets
              facets={specimens.facets}
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
        {metaTitleLoading ||
        ((specimensLoading || calendarDateLoading) && metaTitleEnabled) ? (
          <Loader />
        ) : null}
        {metaTitleError || specimensError || calendarDateError ? (
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
        {specimens?.specimens.length && metaTitle ? (
          <>
            <Tabs
              value={view}
              onTabChange={setView}
              sx={{
                marginTop: rem(5),
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
                  disabled
                  value="table"
                  icon={<IconTableRow size="0.8rem" />}
                >
                  {t('specimens_overview.table')}
                </Tabs.Tab>
              </Tabs.List>
            </Tabs>
            <Suspense fallback={<Loader />}>
              {view === 'calendar' ? (
                <Calendar
                  specimens={specimens.specimens}
                  metaTitle={metaTitle}
                />
              ) : (
                <Table
                  count={specimens.count}
                  specimens={specimens.specimens}
                  specimensRefetching={false}
                  // specimensRefetching={specimensRefetching}
                />
              )}
            </Suspense>
          </>
        ) : null}
      </Flex>
    </Flex>
  )
}

export default SpecimensOverview
