import { FC, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs, { Dayjs } from 'dayjs'
import Box from '@mui/material-pigment-css/Box'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import Button from '@mui/material/Button'
import { DateCalendar } from '@mui/x-date-pickers'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { blue } from '@mui/material/colors'
import FacetGroup from './FacetGroup'
import { useSpecimensOverviewStore } from '../../../slices/useSpecimensOverviewStore'
import { useMutationListQuery } from '../../../api/mutation'
import { usePublicationListQuery } from '../../../api/publication'
import { useLanguageCode } from '../../../utils/helperHooks'
import { useOwnerListQuery } from '../../../api/owner'
import {
  useSpecimenFacetsQuery,
  useSpecimenListQuery,
  useSpecimensStartDateForCalendar,
} from '../../../api/specimen'
import { TMetaTitle } from '../../../schema/metaTitle'
import ShowError from '../../../components/ShowError'
import { TSpecimenDamageTypes } from '../../../schema/specimen'
import Loader from '../../../components/Loader'
import ControlledSlider from './ControlledSlider'
import ControlledBarCodeInput from './ControlledBarCodeInput'

type TProps = {
  metaTitle: TMetaTitle
}

const Facets: FC<TProps> = ({ metaTitle }) => {
  const { t } = useTranslation()
  const { data: mutations } = useMutationListQuery()
  const { data: publications } = usePublicationListQuery()
  const { data: owners } = useOwnerListQuery()
  const { languageCode } = useLanguageCode()
  const [metaTitleIdChanged, setMetaTitleIdChanged] = useState(false)
  const [calendarDateInitialized, setCalendarDateInitialized] = useState(false)
  const [sliderRangeInitialized, setSliderRangeInitialized] = useState(false)

  const params = useSpecimensOverviewStore((state) => state.params)
  const view = useSpecimensOverviewStore((state) => state.view)
  const calendarDate = useSpecimensOverviewStore((state) => state.calendarDate)
  const setParams = useSpecimensOverviewStore((state) => state.setParams)
  const setCalendarDate = useSpecimensOverviewStore(
    (state) => state.setCalendarDate
  )
  const resetAll = useSpecimensOverviewStore((state) => state.resetAll)
  const setSliderRange = useSpecimensOverviewStore(
    (state) => state.setSliderRange
  )
  const setLastViewedMetaTitleId = useSpecimensOverviewStore(
    (state) => state.setLastViewedMetaTitleId
  )
  const lastViewedMetaTitleId = useSpecimensOverviewStore(
    (state) => state.lastViewedMetaTitleId
  )

  const {
    data: facets,
    isError: facetsError,
    isFetching: facetsFetching,
  } = useSpecimenFacetsQuery(metaTitle.id)

  const {
    data: specimens,
    isError: specimensError,
    isFetching: specimensFetching,
  } = useSpecimenListQuery(metaTitle.id)

  const {
    data: calendarDateFromQuery,
    isFetching: calendarStartDateFetching,
    isError: calendarStartDateError,
  } = useSpecimensStartDateForCalendar(metaTitle.id)

  // track if metaTitle changed
  useEffect(() => {
    if (lastViewedMetaTitleId !== metaTitle.id) {
      resetAll()
      setLastViewedMetaTitleId(metaTitle.id)
      setMetaTitleIdChanged(true)
    }
  }, [lastViewedMetaTitleId, metaTitle, resetAll, setLastViewedMetaTitleId])

  // Initialize calendar date
  useEffect(() => {
    if (
      calendarDateFromQuery &&
      metaTitleIdChanged &&
      !calendarDateInitialized
    ) {
      setCalendarDate(dayjs(calendarDateFromQuery.toString()))
      setCalendarDateInitialized(true)
    }
  }, [
    calendarDateFromQuery,
    calendarDateInitialized,
    metaTitleIdChanged,
    setCalendarDate,
  ])

  // Initialize date range slider
  useEffect(() => {
    if (specimens && metaTitleIdChanged && !sliderRangeInitialized) {
      setSliderRange([
        Number(specimens.publicationDayMin?.substring(0, 4)),
        Number(specimens.publicationDayMax?.substring(0, 4)),
      ])
      setSliderRangeInitialized(true)
    }
  }, [metaTitleIdChanged, setSliderRange, sliderRangeInitialized, specimens])

  // Reset initialization indicators after initialization is done
  useEffect(() => {
    if (
      sliderRangeInitialized &&
      calendarDateInitialized &&
      metaTitleIdChanged
    ) {
      setMetaTitleIdChanged(false)
      setCalendarDateInitialized(false)
      setSliderRangeInitialized(false)
    }
  }, [calendarDateInitialized, metaTitleIdChanged, sliderRangeInitialized])

  const pubDaysMin =
    Number(specimens?.publicationDayMin?.substring(0, 4)) || 1900
  const pubDaysMax =
    Number(specimens?.publicationDayMax?.substring(0, 4)) || 2023

  const fetching =
    facetsFetching || specimensFetching || calendarStartDateFetching

  if (facetsError || specimensError || calendarStartDateError) {
    return (
      <>
        <Typography
          variant="h6"
          sx={{
            color: blue['900'],
          }}
        >
          {metaTitle.name}
        </Typography>
        <ShowError />
      </>
    )
  }

  return (
    <>
      <Typography
        variant="h6"
        sx={{
          color: blue['900'],
          fontWeight: '600',
        }}
      >
        {metaTitle.name}
      </Typography>
      <Divider
        sx={{
          marginTop: '10px',
          marginBottom: '10px',
        }}
      />
      <Typography
        variant="body1"
        sx={{
          fontWeight: '700',
        }}
      >
        {t('specimens_overview.date')}
      </Typography>
      {view === 'calendar' ? (
        <Box>
          {dayjs(calendarDate).isValid() ? (
            <DateCalendar
              views={['month', 'year']}
              openTo="month"
              sx={{
                height: 'auto',
              }}
              value={dayjs(calendarDate)}
              minDate={dayjs(specimens?.publicationDayMin)}
              maxDate={dayjs(specimens?.publicationDayMax)}
              onChange={(value: Dayjs) => {
                setCalendarDate(value)
              }}
            />
          ) : (
            <Loader />
          )}
        </Box>
      ) : (
        <ControlledSlider
          fetching={fetching}
          pubDaysMin={pubDaysMin}
          pubDaysMax={pubDaysMax}
        />
      )}
      <Typography
        variant="body2"
        sx={{
          // marginTop: '30px',
          marginBottom: '10px',
          fontWeight: '700',
        }}
      >
        {t('specimens_overview.volume')}
      </Typography>
      <ControlledBarCodeInput />
      <Divider
        sx={{
          marginTop: '10px',
        }}
      />
      <Box
        sx={() => ({
          paddingRight: '8px',
          overflowY: 'scroll',
        })}
      >
        <FacetGroup
          disabled={fetching}
          facets={
            facets?.names.length
              ? facets.names
              : params.names.map((p) => ({ name: p, count: 0 }))
          }
          header={t('specimens_overview.name')}
          onChange={(value) => setParams({ ...params, names: value })}
          values={params.names}
        />
        <FacetGroup
          disabled={fetching}
          facets={
            facets?.subNames.length
              ? facets.subNames
              : params.subNames.map((p) => ({ name: p, count: 0 }))
          }
          header={t('specimens_overview.sub_name')}
          onChange={(value) => setParams({ ...params, subNames: value })}
          values={params.subNames}
        />
        <FacetGroup
          disabled={fetching}
          facets={
            facets?.mutationIds.length
              ? facets.mutationIds.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: mutations?.find((mc) => mc.id === m.name)
                    ?.name[languageCode],
                }))
              : params.mutationIds.map((p) => ({
                  name: p,
                  count: 0,
                  displayedName: mutations?.find((mc) => mc.id === p)?.name[
                    languageCode
                  ],
                }))
          }
          header={t('specimens_overview.mutation')}
          onChange={(value) => setParams({ ...params, mutationIds: value })}
          values={params.mutationIds}
        />
        <FacetGroup
          disabled={fetching}
          facets={
            facets?.publicationIds.length
              ? facets.publicationIds.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: publications?.find((mc) => mc.id === m.name)
                    ?.name[languageCode],
                }))
              : params.publicationIds.map((p) => ({
                  name: p,
                  count: 0,
                  displayedName: publications?.find((mc) => mc.id === p)?.name[
                    languageCode
                  ],
                }))
          }
          header={t('specimens_overview.publication')}
          onChange={(value) =>
            setParams({
              ...params,
              publicationIds: value,
            })
          }
          values={params.publicationIds}
        />
        <FacetGroup
          disabled={fetching}
          facets={
            facets?.publicationMarks.length
              ? facets.publicationMarks
              : params.publicationMarks.map((p) => ({ name: p, count: 0 }))
          }
          header={t('specimens_overview.publication_mark')}
          onChange={(value) =>
            setParams({
              ...params,
              publicationMarks: value,
            })
          }
          values={params.publicationMarks}
        />
        <FacetGroup
          disabled={fetching}
          facets={
            facets?.ownerIds.length
              ? facets.ownerIds.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: owners?.find((mc) => mc.id === m.name)?.name,
                }))
              : params.ownerIds.map((p) => ({
                  name: p,
                  count: 0,
                  displayedName: owners?.find((mc) => mc.id === p)?.name,
                }))
          }
          header={t('specimens_overview.owner')}
          onChange={(value) =>
            setParams({
              ...params,
              ownerIds: value,
            })
          }
          values={params.ownerIds}
        />
        <FacetGroup
          disabled={fetching}
          facets={
            facets?.damageTypes.length
              ? facets.damageTypes.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: t(`facet_states.${m.name}`),
                }))
              : params.damageTypes.map((p) => ({
                  name: p,
                  count: 0,
                  displayedName: t(`facet_states.${p as TSpecimenDamageTypes}`),
                }))
          }
          header={t('specimens_overview.state')}
          onChange={(value) =>
            setParams({
              ...params,
              damageTypes: value,
            })
          }
          values={params.damageTypes}
        />
      </Box>
      <Divider
        sx={{
          marginBottom: '10px',
        }}
      />
      <Button
        startIcon={<DeleteOutlineOutlinedIcon />}
        variant="outlined"
        color="error"
        onClick={() => {
          resetAll()
          setSliderRange([pubDaysMin, pubDaysMax])
          setCalendarDate(dayjs(specimens?.publicationDayMin))
        }}
      >
        {t('specimens_overview.delete_filters')}
      </Button>
    </>
  )
}

export default Facets
