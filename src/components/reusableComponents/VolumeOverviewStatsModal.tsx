import { Box, Flex, Text } from '@mantine/core'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useVolumeOverviewStatsQuery } from '../../api/volume'
import Loader from './Loader'
import ShowError from './ShowError'
import { useOwnerListQuery } from '../../api/owner'
import { useMutationListQuery } from '../../api/mutation'
import { usePublicationListQuery } from '../../api/publication'
import { useLanguageCode } from '../../utils/helperHooks'

type TProps = {
  volumeBarCode: string
}

const VolumeOverviewStatsModal: FC<TProps> = ({ volumeBarCode }) => {
  const { t } = useTranslation()

  const { languageCode } = useLanguageCode()

  const {
    data: owners,
    isLoading: ownersLoading,
    isError: ownersError,
  } = useOwnerListQuery()
  const {
    data: mutations,
    isLoading: mutationsLoading,
    isError: mutationsError,
  } = useMutationListQuery()
  const {
    data: publications,
    isLoading: publicationsLoading,
    isError: publicationsError,
  } = usePublicationListQuery()

  const {
    data: volumeStats,
    isLoading: volumeStatsLoading,
    isError: volumeStatsError,
  } = useVolumeOverviewStatsQuery(volumeBarCode)

  if (
    volumeStatsLoading ||
    ownersLoading ||
    mutationsLoading ||
    publicationsLoading
  )
    return <Loader />
  if (
    volumeStatsError ||
    !volumeStats ||
    ownersError ||
    !owners ||
    mutationsError ||
    !mutations ||
    publicationsError ||
    !publications
  )
    return <ShowError />

  return (
    <Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.meta_title')}:</Text>
        <Text>{volumeStats.metaTitleName}</Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.owner')}:</Text>
        <Text>{owners.find((o) => o.id === volumeStats.ownerId)?.name}</Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.signature')}:</Text>
        <Text>{volumeStats.signature}</Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.bar_code')}:</Text>
        <Text>{volumeStats.barCode}</Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.mutation')}:</Text>
        {volumeStats.mutationIds.map((m) => (
          <Flex key={m.name} w="45%" justify="space-between">
            <Text>
              {mutations.find((mk) => mk.id === m.name)?.name[languageCode]}
            </Text>
            <Text>{m.count}x</Text>
          </Flex>
        ))}
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.year')}:</Text>
        {volumeStats.publicationDayRanges.map((d) => (
          <Flex key={d.name} w="45%" justify="space-between">
            <Text>{dayjs(d.name).format('YYYY')}</Text>
            <Text>{d.count}x</Text>
          </Flex>
        ))}
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.dates')}:</Text>
        <Text>
          {dayjs(volumeStats.publicationDayMin).format('DD.MM.YYYY')} -{' '}
          {dayjs(volumeStats.publicationDayMax).format('DD.MM.YYYY')}
        </Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.numbers')}:</Text>{' '}
        <Text>
          {volumeStats.numberMin} - {volumeStats.numberMax}
        </Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.pages_count')}:</Text>
        <Text>{volumeStats.pagesCount}</Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.publication_mark')}:</Text>
        {volumeStats.publicationMark.map((pm) => (
          <Flex key={pm.name} w="45%" justify="space-between">
            <Text>
              {pm.name.length ? pm.name : t('specimens_overview.without_mark')}
            </Text>
            <Text>{pm.count}x</Text>
          </Flex>
        ))}
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.publication')}:</Text>
        {volumeStats.publicationIds.map((p) => (
          <Flex key={p.name} w="45%" justify="space-between">
            <Text>
              {publications.find((pk) => pk.id === p.name)?.name[languageCode]}
            </Text>
            <Text>{p.count}x</Text>
          </Flex>
        ))}
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('facet_states.OK')}:</Text>
        <Text>
          {t('common.yes')}:{' '}
          {
            volumeStats.specimens.filter(
              (sp) => sp.numExists && sp.damageTypes?.find((s) => s === 'OK')
            ).length
          }
        </Text>
        <Text>
          {t('common.no')}:{' '}
          {
            volumeStats.specimens.filter(
              (sp) => sp.numExists && !sp.damageTypes?.find((s) => s === 'OK')
            ).length
          }
        </Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.damage_types_overview')}:</Text>
        {volumeStats.damageTypes
          .filter((s) => s.name !== 'OK')
          .map((s) => (
            <Flex key={s.name} w="45%" justify="space-between">
              <Text>{t(`facet_states.${s.name}`)}</Text>
              <Text>{s.count}x</Text>
            </Flex>
          ))}
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.missing_numbers')}:</Text>
        {volumeStats.specimens
          .filter((s) => s.numMissing)
          .map((s) => (
            <Text key={s.id}>
              {dayjs(s.publicationDate).format('DD.MM.YYYY')}
            </Text>
          ))}
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.physical_condition')}:</Text>
        <Text>
          {volumeStats.damageTypes.findIndex((s) => s.name !== 'OK')
            ? t('volume_overview.state_not_ok')
            : t('volume_overview.state_ok')}
        </Text>
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.damaged_numbers')}:</Text>
        {volumeStats.specimens
          .filter(
            (s) =>
              s.damageTypes?.includes('PP') &&
              Number(s.number) >= 0 &&
              !s.numMissing
          )
          .map((s) => (
            <Flex key={s.name} w="45%" justify="space-between">
              <Text>{dayjs(s.publicationDate).format('dd DD.MM.YYYY')}</Text>
              <Text>
                {t('volume_overview.number').toLowerCase()} {s.number}
              </Text>
            </Flex>
          ))}
      </Box>
      <Box mb={10}>
        <Text fw="bolder">{t('volume_overview.notes')}:</Text>
        {volumeStats.specimens
          .filter((s) => s.note.length)
          .map((s) => (
            <Flex key={s.name} justify="space-between">
              <Flex gap={50}>
                <Text>{dayjs(s.publicationDate).format('dd DD.MM.YYYY')}</Text>
                <Text>
                  {t('volume_overview.number').toLowerCase()} {s.number}
                </Text>
              </Flex>
              <Text>{s.note}</Text>
            </Flex>
          ))}
      </Box>
    </Box>
  )
}

export default VolumeOverviewStatsModal
