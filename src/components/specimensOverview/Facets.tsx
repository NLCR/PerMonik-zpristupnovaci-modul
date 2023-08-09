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
import { MonthPicker } from '@mantine/dates'
import FacetGroup from './FacetGroup'
import { owners, states } from '../../utils/constants'
import {
  TSpecimensFacets,
  TSpecimensPublicationDays,
} from '../../@types/specimen'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'
import { useTranslatedConstants } from '../../utils/helperHooks'

type TProps = {
  metaTitleName: string
  specimensRefetching: boolean
  facets: TSpecimensFacets
} & TSpecimensPublicationDays

const Facets: FC<TProps> = ({
  metaTitleName,
  specimensRefetching,
  facets,
  publicationDayMin,
  publicationDayMax,
}) => {
  const { t } = useTranslation()
  const { publications, mutations } = useTranslatedConstants()
  const {
    volumeInput,
    params,
    view,
    calendarDate,
    calendarMinDate,
    setVolumeInput,
    setParams,
    setCalendarDate,
    resetAll,
  } = useSpecimensOverviewStore()
  const [date, setDate] = useState(calendarMinDate)

  const datesMin = Number(publicationDayMin?.substring(0, 4)) || 1900
  const datesMax = Number(publicationDayMax?.substring(0, 4)) || 2023

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
        <MonthPicker
          value={calendarDate}
          date={date}
          onChange={setCalendarDate}
          onDateChange={setDate}
          maxDate={new Date()}
          minDate={calendarMinDate}
        />
      ) : (
        <RangeSlider
          mt="sm"
          step={1}
          min={datesMin}
          max={datesMax}
          disabled={specimensRefetching}
          onChangeEnd={(value) =>
            setParams({
              ...params,
              dateStart: value[0],
              dateEnd: value[1],
            })
          }
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
      )}

      {view === 'table' ? (
        <>
          <Text mt={40} mb={5} fz="sm" fw={700}>
            {t('specimens_overview.volume')}
          </Text>
          <TextInput
            value={volumeInput}
            // disabled={specimensRefetching}
            onChange={(event) => setVolumeInput(event.target.value)}
          />
        </>
      ) : null}

      <Divider mt={10} />
      <ScrollArea
        sx={(theme) => ({
          paddingRight: theme.spacing.xs,
        })}
      >
        <FacetGroup
          disabled={specimensRefetching}
          facets={facets.names}
          header={t('specimens_overview.name')}
          onChange={(value) => setParams({ ...params, names: value })}
          values={params.names}
        />
        <FacetGroup
          disabled={specimensRefetching}
          facets={facets.subNames}
          header={t('specimens_overview.sub_name')}
          onChange={(value) => setParams({ ...params, subNames: value })}
          values={params.subNames}
        />
        <FacetGroup
          disabled={specimensRefetching}
          facets={facets.mutations.map((m) => ({
            name: m.name,
            count: m.count,
            displayedName: mutations.find((mc) => mc.id === Number(m.name))
              ?.name,
          }))}
          header={t('specimens_overview.mutation')}
          onChange={(value) => setParams({ ...params, mutations: value })}
          values={params.mutations}
        />
        <FacetGroup
          disabled={specimensRefetching}
          facets={facets.publications.map((m) => ({
            name: m.name,
            count: m.count,
            displayedName: publications.find((mc) => mc.id === Number(m.name))
              ?.name,
          }))}
          header={t('specimens_overview.publication')}
          onChange={(value) =>
            setParams({
              ...params,
              publications: value,
            })
          }
          values={params.publications}
        />
        <FacetGroup
          disabled={specimensRefetching}
          facets={facets.publicationMarks}
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
          facets={facets.owners.map((m) => ({
            name: m.name,
            count: m.count,
            displayedName: owners.find((mc) => mc.id === Number(m.name))?.name,
          }))}
          header={t('specimens_overview.owner')}
          onChange={(value) =>
            setParams({
              ...params,
              owners: value,
            })
          }
          values={params.owners}
        />
        <FacetGroup
          disabled={specimensRefetching}
          facets={facets.states.map((m) => ({
            name: m.name,
            count: m.count,
            displayedName: t(
              `facet_states.${m.name as (typeof states)[number]}`
            ),
          }))}
          header={t('specimens_overview.state')}
          onChange={(value) =>
            setParams({
              ...params,
              states: value,
            })
          }
          values={params.states}
        />
      </ScrollArea>
      <Divider mb={10} />
      <Button
        leftIcon={<IconEraser />}
        variant="white"
        color="red"
        onClick={() => {
          resetAll()
        }}
      >
        {t('specimens_overview.delete_filters')}
      </Button>
    </>
  )
}

export default Facets
