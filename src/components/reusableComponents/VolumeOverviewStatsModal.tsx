import { Box, Text } from '@mantine/core'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import useVolumeOverviewStatsQuery from '../../api/query/useVolumeOverviewStatsQuery'
import Loader from './Loader'
import ShowError from './ShowError'
import { owners } from '../../utils/constants'
import { useTranslatedConstants } from '../../utils/helperHooks'

type TProps = {
  volumeBarCode: string
}

const VolumeOverviewStatsModal: FC<TProps> = ({ volumeBarCode }) => {
  const { t } = useTranslation()
  const { mutations, publications } = useTranslatedConstants()

  const {
    data: volumeStats,
    isLoading,
    isError,
  } = useVolumeOverviewStatsQuery(volumeBarCode)

  if (isLoading) return <Loader />
  if (isError || !volumeStats) return <ShowError />

  return (
    <Box>
      <Text>
        {t('volume_overview.meta_title')}: {volumeStats.metaTitleName}
      </Text>
      <Text>
        {t('volume_overview.owner')}:{' '}
        {owners.find((o) => o.id === Number(volumeStats.owner))?.name}
      </Text>
      <Text>
        {t('volume_overview.signature')}: {volumeStats.signature}
      </Text>
      <Text>
        {t('volume_overview.bar_code')}: {volumeStats.barCode}
      </Text>
      <Text>
        {t('volume_overview.mutation')}:{' '}
        {volumeStats.mutations.map((m) => (
          <>
            <Text>
              {mutations.find((mk) => mk.id === Number(m.name))?.name}
            </Text>
            <Text>{m.count}x</Text>
          </>
        ))}
      </Text>
      <Text>
        {t('volume_overview.year')}:{' '}
        {volumeStats.publicationDayRanges.map((d) => (
          <>
            <Text>{dayjs(d.name).format('YYYY')}</Text>
            <Text>{d.count}x</Text>
          </>
        ))}
      </Text>
      <Text>
        {t('volume_overview.dates')}:{' '}
        {dayjs(volumeStats.publicationDayMin).format('DD.MM.YYYY')} -{' '}
        {dayjs(volumeStats.publicationDayMax).format('DD.MM.YYYY')}
      </Text>
      <Text>
        {t('volume_overview.numbers')}: {volumeStats.numberMin} -{' '}
        {volumeStats.numberMax}
      </Text>
      <Text>
        {t('volume_overview.pages_count')}: {volumeStats.pagesCount}
      </Text>
      <Text>
        {t('volume_overview.publication_mark')}:{' '}
        {volumeStats.publicationMark.map((pm) => (
          <>
            <Text>
              {pm.name.length ? pm.name : t('specimens_overview.without_mark')}
            </Text>
            <Text>{pm.count}x</Text>
          </>
        ))}
      </Text>
      <Text>
        {t('volume_overview.publication')}:{' '}
        {volumeStats.publication.map((p) => (
          <>
            <Text>
              {publications.find((pk) => pk.id === Number(p.name))?.name}
            </Text>
            <Text>{p.count}x</Text>
          </>
        ))}
      </Text>
      <Text>
        {t('facet_states.OK')}:{' '}
        <Text>
          {t('common.yes')}:{' '}
          {
            volumeStats.specimens.filter(
              (sp) => sp.numExists && sp.states?.find((s) => s === 'OK')
            ).length
          }
        </Text>
        <Text>
          {t('common.no')}:{' '}
          {
            volumeStats.specimens.filter(
              (sp) => sp.numExists && !sp.states?.find((s) => s === 'OK')
            ).length
          }
        </Text>
      </Text>
      <Text>
        {t('volume_overview.damage_types_overview')}:{' '}
        {volumeStats.states
          .filter((s) => s.name !== 'OK')
          .map((s) => (
            <>
              <Text>{t(`facet_states.${s.name}`)}</Text>
              <Text>{s.count}x</Text>
            </>
          ))}
      </Text>
      <Text>
        {t('volume_overview.missing_numbers')}:{' '}
        {volumeStats.specimens
          .filter((s) => s.numMissing)
          .map((s) => (
            <Text key={s.id}>
              {dayjs(s.publicationDate).format('DD.MM.YYYY')}
            </Text>
          ))}
      </Text>
      <Text>
        {t('volume_overview.physical_condition')}:{' '}
        {volumeStats.states.findIndex((s) => s.name !== 'OK')
          ? t('volume_overview.state_not_ok')
          : t('volume_overview.state_ok')}
      </Text>
      <Text>
        {t('volume_overview.damaged_numbers')}:{' '}
        {volumeStats.specimens
          .filter(
            (s) =>
              s.states?.includes('PP') && Number(s.number) >= 0 && !s.numMissing
          )
          .map((s) => (
            <>
              <Text>{dayjs(s.publicationDate).format('dd DD.MM.YYYY')}</Text>
              <Text>
                {t('volume_overview.number').toLowerCase()} {s.number}
              </Text>
            </>
          ))}
      </Text>
      <Text>
        {t('volume_overview.notes')}:{' '}
        {volumeStats.specimens
          .filter((s) => s.note.length)
          .map((s) => (
            <>
              <Text>{dayjs(s.publicationDate).format('dd DD.MM.YYYY')}</Text>
              <Text>
                {t('volume_overview.number').toLowerCase()} {s.number}
              </Text>
              <Text>{s.note}</Text>
            </>
          ))}
      </Text>
    </Box>
  )
}

export default VolumeOverviewStatsModal
