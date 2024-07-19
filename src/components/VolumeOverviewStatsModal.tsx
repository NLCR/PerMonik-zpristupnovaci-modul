import { Box, Typography } from '@mui/material'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useVolumeOverviewStatsQuery } from '../api/volume'
import Loader from './Loader'
import ShowError from './ShowError'
import { useOwnerListQuery } from '../api/owner'
import { useMutationListQuery } from '../api/mutation'
import { usePublicationListQuery } from '../api/publication'
import { useLanguageCode } from '../utils/helperHooks'

const bolderTextStyle = {
  fontWeight: '600',
}

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
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.meta_title')}:
        </Typography>
        <Typography variant="body2">{volumeStats.metaTitleName}</Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.owner')}:
        </Typography>
        <Typography variant="body2">
          {owners.find((o) => o.id === volumeStats.ownerId)?.name}
        </Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.signature')}:
        </Typography>
        <Typography variant="body2">{volumeStats.signature}</Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.bar_code')}:
        </Typography>
        <Typography variant="body2">{volumeStats.barCode}</Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.mutation')}:
        </Typography>
        {volumeStats.mutationIds.map((m) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '45%',
            }}
            key={m.name}
          >
            <Typography variant="body2">
              {mutations.find((mk) => mk.id === m.name)?.name[languageCode]}
            </Typography>
            <Typography variant="body2">{m.count}x</Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.year')}:
        </Typography>
        {volumeStats.publicationDayRanges.map((d) => (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '45%',
            }}
            key={d.name}
          >
            <Typography variant="body2">
              {dayjs(d.name).format('YYYY')}
            </Typography>
            <Typography variant="body2">{d.count}x</Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.dates')}:
        </Typography>
        <Typography variant="body2">
          {dayjs(volumeStats.publicationDayMin).format('DD.MM.YYYY')} -{' '}
          {dayjs(volumeStats.publicationDayMax).format('DD.MM.YYYY')}
        </Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.numbers')}:
        </Typography>{' '}
        <Typography variant="body2">
          {volumeStats.numberMin} - {volumeStats.numberMax}
        </Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.pages_count')}:
        </Typography>
        <Typography variant="body2">{volumeStats.pagesCount}</Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.publication_mark')}:
        </Typography>
        {volumeStats.publicationMark.map((pm) => (
          <Box
            key={pm.name}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '45%',
            }}
          >
            <Typography variant="body2">
              {pm.name.length ? pm.name : t('specimens_overview.without_mark')}
            </Typography>
            <Typography variant="body2">{pm.count}x</Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.publication')}:
        </Typography>
        {volumeStats.publicationIds.map((p) => (
          <Box
            key={p.name}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '45%',
            }}
          >
            <Typography variant="body2">
              {publications.find((pk) => pk.id === p.name)?.name[languageCode]}
            </Typography>
            <Typography variant="body2">{p.count}x</Typography>
          </Box>
        ))}
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>{t('facet_states.OK')}:</Typography>
        <Typography variant="body2">
          {t('common.yes')}:{' '}
          {
            volumeStats.specimens.filter(
              (sp) => sp.numExists && sp.damageTypes?.find((s) => s === 'OK')
            ).length
          }
        </Typography>
        <Typography variant="body2">
          {t('common.no')}:{' '}
          {
            volumeStats.specimens.filter(
              (sp) => sp.numExists && !sp.damageTypes?.find((s) => s === 'OK')
            ).length
          }
        </Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.damage_types_overview')}:
        </Typography>
        {volumeStats.damageTypes
          .filter((s) => s.name !== 'OK')
          .map((s) => (
            <Box
              key={s.name}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '45%',
              }}
            >
              <Typography variant="body2">
                {t(`facet_states.${s.name}`)}
              </Typography>
              <Typography variant="body2">{s.count}x</Typography>
            </Box>
          ))}
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.missing_numbers')}:
        </Typography>
        {volumeStats.specimens
          .filter((s) => s.numMissing)
          .map((s) => (
            <Typography variant="body2" key={s.id}>
              {dayjs(s.publicationDate).format('DD.MM.YYYY')}
            </Typography>
          ))}
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.physical_condition')}:
        </Typography>
        <Typography variant="body2">
          {volumeStats.damageTypes.findIndex((s) => s.name !== 'OK')
            ? t('volume_overview.state_not_ok')
            : t('volume_overview.state_ok')}
        </Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.damaged_numbers')}:
        </Typography>
        {volumeStats.specimens
          .filter(
            (s) =>
              s.damageTypes?.includes('PP') &&
              Number(s.number) >= 0 &&
              !s.numMissing
          )
          .map((s) => (
            <Box
              key={s.name}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '45%',
              }}
            >
              <Typography variant="body2">
                {dayjs(s.publicationDate).format('dd DD.MM.YYYY')}
              </Typography>
              <Typography variant="body2">
                {t('volume_overview.number').toLowerCase()} {s.number}
              </Typography>
            </Box>
          ))}
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.notes')}:
        </Typography>
        {volumeStats.specimens
          .filter((s) => s.note.length)
          .map((s) => (
            <Box
              key={s.name}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  gap: '45px',
                }}
              >
                <Typography variant="body2">
                  {dayjs(s.publicationDate).format('dd DD.MM.YYYY')}
                </Typography>
                <Typography variant="body2">
                  {t('volume_overview.number').toLowerCase()} {s.number}
                </Typography>
              </Box>
              <Typography variant="body2">{s.note}</Typography>
            </Box>
          ))}
      </Box>
    </Box>
  )
}

export default VolumeOverviewStatsModal
