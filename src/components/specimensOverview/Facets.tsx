/* eslint-disable react/prop-types */
import {
  Button,
  Divider,
  RangeSlider,
  ScrollArea,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { IconEraser } from '@tabler/icons-react'
import { FC, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DatePickerValue, MonthPicker } from '@mantine/dates'
import dayjs from 'dayjs'
import FacetGroup from './FacetGroup'
import { damageTypes } from '../../utils/constants'
import {
  TSpecimen,
  TSpecimensFacets,
  TSpecimensPublicationDays,
} from '../../@types/specimen'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'
import { useMutationListQuery } from '../../api/mutation'
import { usePublicationListQuery } from '../../api/publication'
import { useLanguageCode } from '../../utils/helperHooks'
import { useOwnerListQuery } from '../../api/owner'

type TProps = {
  metaTitleName: string
  specimensRefetching: boolean
  facets: TSpecimensFacets
  specimens: TSpecimen[]
} & TSpecimensPublicationDays

const Facets: FC<TProps> = ({
  metaTitleName,
  specimensRefetching,
  facets,
  specimens,
  publicationDayMin,
  publicationDayMax,
}) => {
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

  const datesMin = Number(publicationDayMin?.substring(0, 4)) || 1900
  const datesMax = Number(publicationDayMax?.substring(0, 4)) || 2023

  const [date, setDate] = useState(calendarMinDate)
  const [range, setRange] = useState<[number, number]>([datesMin, datesMax])

  useSpecimensOverviewStore.subscribe((state, prevState) => {
    if (
      state.view === 'calendar' &&
      prevState.view === 'table' &&
      specimens.length
    ) {
      setCalendarDate(dayjs(specimens[0].publicationDate).toDate())
      setDate(dayjs(specimens[0].publicationDate).toDate())
    }
  })

  return (
    <>
      <Title size="h4" color="blue.9">
        {metaTitleName}
      </Title>
      <Divider mt={10} mb={10} />
      <Text fz="sm" fw={700}>
        {t('specimens_overview.date')}
      </Text>
      {view === 'calendar' ? (
        <>
          <MonthPicker
            value={calendarDate}
            date={date}
            onChange={(value: DatePickerValue) => {
              setCalendarDate(value)
              setRange((prevState) => [
                Number(dayjs(value).format('YYYY')),
                prevState[1],
              ])
              setParams({
                ...params,
                dateStart: Number(dayjs(value).format('YYYY')),
                dateEnd: range[1],
              })
            }}
            onDateChange={setDate}
            maxDate={dayjs(datesMax.toString()).toDate()}
            minDate={dayjs(datesMin.toString()).toDate()}
          />
          <Divider mt={10} />
        </>
      ) : null}
      <RangeSlider
        mt="sm"
        step={1}
        minRange={0}
        value={range}
        min={datesMin}
        max={datesMax}
        disabled={specimensRefetching}
        onChange={(value) => setRange(value)}
        onChangeEnd={(value) => {
          setCalendarDate(dayjs(value[0].toString()).toDate())
          setDate(dayjs(value[0].toString()).toDate())
          setParams({
            ...params,
            dateStart: value[0],
            dateEnd: value[1],
          })
        }}
        // labelAlwaysOn
        marks={[
          {
            value: datesMin,
            label: datesMin,
          },
          {
            value: datesMax,
            label: datesMax,
          },
        ]}
      />
      {/* {view === 'table' ? ( */}
      {/* <> */}
      <Text mt={30} mb={5} fz="sm" fw={700}>
        {t('specimens_overview.volume')}
      </Text>
      <TextInput
        value={barCodeInput}
        // disabled={specimensRefetching}
        onChange={(event) => setBarCodeInput(event.target.value)}
      />
      {/* </> */}
      {/* ) : null} */}

      <Divider mt={10} />
      <ScrollArea
        sx={(theme) => ({
          paddingRight: theme.spacing.xs,
        })}
      >
        <FacetGroup
          disabled={specimensRefetching}
          facets={
            facets.names.length
              ? facets.names
              : params.names.map((p) => ({ name: p, count: 0 }))
          }
          header={t('specimens_overview.name')}
          onChange={(value) => setParams({ ...params, names: value })}
          values={params.names}
        />
        <FacetGroup
          disabled={specimensRefetching}
          facets={
            facets.subNames.length
              ? facets.subNames
              : params.subNames.map((p) => ({ name: p, count: 0 }))
          }
          header={t('specimens_overview.sub_name')}
          onChange={(value) => setParams({ ...params, subNames: value })}
          values={params.subNames}
        />
        <FacetGroup
          disabled={specimensRefetching}
          facets={
            facets.mutationIds.length
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
          disabled={specimensRefetching}
          facets={
            facets.publicationIds.length
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
          disabled={specimensRefetching}
          facets={
            facets.publicationMarks.length
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
          disabled={specimensRefetching}
          facets={
            facets.ownerIds.length
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
          disabled={specimensRefetching}
          facets={
            facets.damageTypes.length
              ? facets.damageTypes.map((m) => ({
                  name: m.name,
                  count: m.count,
                  displayedName: t(
                    `facet_states.${m.name as (typeof damageTypes)[number]}`
                  ),
                }))
              : params.damageTypes.map((p) => ({
                  name: p,
                  count: 0,
                  displayedName: t(
                    `facet_states.${p as (typeof damageTypes)[number]}`
                  ),
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
      </ScrollArea>
      <Divider mb={10} />
      <Button
        leftIcon={<IconEraser />}
        variant="white"
        color="red"
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
