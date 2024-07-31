import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs, { Dayjs } from 'dayjs'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Slider from '@mui/material/Slider'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import { DateCalendar } from '@mui/x-date-pickers'
import DeleteOutlineOutlinedIcon from '@mui/icons-material/DeleteOutlineOutlined'
import { blue } from '@mui/material/colors'
import isArray from 'lodash/isArray'
import FacetGroup from './FacetGroup'
import { useSpecimensOverviewStore } from '../../../slices/useSpecimensOverviewStore'
import { useMutationListQuery } from '../../../api/mutation'
import { usePublicationListQuery } from '../../../api/publication'
import { useLanguageCode } from '../../../utils/helperHooks'
import { useOwnerListQuery } from '../../../api/owner'
import {
  useSpecimenFacetsQuery,
  useSpecimenListQuery,
} from '../../../api/specimen'
import { TMetaTitle } from '../../../schema/metaTitle'
import ShowError from '../../../components/ShowError'
import { TSpecimenDamageTypes } from '../../../schema/specimen'

type TProps = {
  metaTitle: TMetaTitle
}

const Facets: FC<TProps> = ({ metaTitle }) => {
  const { t } = useTranslation()
  const { data: mutations } = useMutationListQuery()
  const { data: publications } = usePublicationListQuery()
  const { data: owners } = useOwnerListQuery()
  const { languageCode } = useLanguageCode()
  const {
    barCodeInput,
    params,
    view,
    calendarDate,
    calendarMinDate,
    setBarCodeInput,
    setParams,
    setCalendarDate,
    resetAll,
  } = useSpecimensOverviewStore()

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

  const datesMin = Number(specimens?.publicationDayMin?.substring(0, 4)) || 1900
  const datesMax = Number(specimens?.publicationDayMax?.substring(0, 4)) || 2023

  const [date, setDate] = useState(calendarMinDate)
  const [range, setRange] = useState<[number, number]>([datesMin, datesMax])

  useSpecimensOverviewStore.subscribe((state, prevState) => {
    if (
      state.view === 'calendar' &&
      prevState.view === 'table' &&
      specimens?.specimens.length
    ) {
      setCalendarDate(dayjs(specimens.specimens[0].publicationDate).toDate())
      setDate(dayjs(specimens.specimens[0].publicationDate).toDate())
    }
  })

  const fetching = facetsFetching || specimensFetching

  if (facetsError || specimensError) {
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
          <DateCalendar
            views={['month', 'year']}
            openTo="month"
            sx={{
              height: 'auto',
            }}
            defaultValue={dayjs(date)}
            value={dayjs(calendarDate)}
            minDate={dayjs(datesMin.toString())}
            maxDate={dayjs(datesMax.toString())}
            onChange={(value: Dayjs) => {
              setCalendarDate(value.toDate())
              setRange((prevState) => [
                Number(value.format('YYYY')),
                prevState[1],
              ])
              setParams({
                ...params,
                dateStart: Number(value.format('YYYY')),
                dateEnd: range[1],
              })
            }}
          />
        </Box>
      ) : (
        <Slider
          disableSwap
          step={1}
          // defaultValue={date}
          // minRange={0}
          sx={{
            width: '95%',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: '30px',
          }}
          valueLabelDisplay="auto"
          marks={[
            { value: datesMin, label: `${datesMin}` },
            { value: datesMax, label: `${datesMax}` },
          ]}
          value={range}
          onChange={(event, value) => {
            if (isArray(value)) {
              setRange([value[0], value[1]])
            }
          }}
          onChangeCommitted={(event, value) => {
            if (isArray(value)) {
              setCalendarDate(dayjs(value[0].toString()).toDate())
              setDate(dayjs(value[0].toString()).toDate())
              setParams({
                ...params,
                dateStart: value[0],
                dateEnd: value[1],
              })
            }
          }}
          min={datesMin}
          max={datesMax}
          disabled={fetching}
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
      <TextField
        size="small"
        value={barCodeInput}
        disabled={fetching}
        onChange={(event) => setBarCodeInput(event.target.value)}
      />
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
          setDate(dayjs(datesMin.toString()).toDate())
          setRange([datesMin, datesMax])
        }}
      >
        {t('specimens_overview.delete_filters')}
      </Button>
    </>
  )
}

export default Facets
