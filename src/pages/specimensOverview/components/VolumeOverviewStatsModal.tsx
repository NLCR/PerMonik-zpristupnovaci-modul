import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import { useVolumeOverviewStatsQuery } from '../../../api/volume'
import Loader from '../../../components/Loader'
import ShowError from '../../../components/ShowError'
import { useOwnerListQuery } from '../../../api/owner'
import { useMutationListQuery } from '../../../api/mutation'
import { useEditionListQuery } from '../../../api/edition'
import { useLanguageCode } from '../../../utils/helperHooks'
import isFinite from 'lodash/isFinite'

const bolderTextStyle = {
  fontWeight: '600',
}

type TProps = {
  volumeId?: string
}

const VolumeOverviewStatsModal: FC<TProps> = ({ volumeId = undefined }) => {
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
    data: editions,
    isLoading: editionsLoading,
    isError: editionsError,
  } = useEditionListQuery()

  const {
    data: volumeStats,
    isLoading: volumeStatsLoading,
    isError: volumeStatsError,
  } = useVolumeOverviewStatsQuery(volumeId)

  const numbers = useMemo(
    () =>
      volumeStats?.specimens
        .filter(
          (s) =>
            s.numExists &&
            !s.isAttachment &&
            s.number?.length &&
            isFinite(Number(s.number))
        )
        .map((s) => Number(s.number)) || [],
    [volumeStats?.specimens]
  )

  const attachmentNumbers = useMemo(
    () =>
      volumeStats?.specimens
        .filter(
          (s) =>
            s.numExists &&
            s.isAttachment &&
            s.attachmentNumber?.length &&
            isFinite(Number(s.attachmentNumber))
        )
        .map((s) => Number(s.attachmentNumber)) || [],
    [volumeStats?.specimens]
  )

  if (
    volumeStatsLoading ||
    ownersLoading ||
    mutationsLoading ||
    editionsLoading
  )
    return <Loader />
  if (
    volumeStatsError ||
    !volumeStats ||
    ownersError ||
    !owners ||
    mutationsError ||
    !mutations ||
    editionsError ||
    !editions
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
        </Typography>
        <Typography variant="body2">
          {numbers.length ? (
            <>
              {Math.min(...numbers)} - {Math.max(...numbers)}
            </>
          ) : null}
        </Typography>
      </Box>
      <Box
        sx={{
          marginBottom: '10px',
        }}
      >
        <Typography sx={bolderTextStyle}>
          {t('volume_overview.attachment_numbers')}:
        </Typography>
        <Typography variant="body2">
          {attachmentNumbers.length ? (
            <>
              {Math.min(...attachmentNumbers)} -{' '}
              {Math.max(...attachmentNumbers)}
            </>
          ) : null}
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
          {t('volume_overview.mutation_mark')}:
        </Typography>
        {volumeStats.mutationMarks.map((pm) => (
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
          {t('volume_overview.edition')}:
        </Typography>
        {volumeStats.editionIds.map((p) => (
          <Box
            key={p.name}
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              width: '45%',
            }}
          >
            <Typography variant="body2">
              {editions.find((pk) => pk.id === p.name)?.name[languageCode]}
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
            <Box
              key={s.name}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '45%',
              }}
            >
              <Typography variant="body2">{s.number}</Typography>
              <Typography variant="body2" key={s.id}>
                {dayjs(s.publicationDate).format('DD.MM.YYYY')}
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
          {t('volume_overview.physical_condition')}:
        </Typography>
        <Typography variant="body2">
          {volumeStats.damageTypes.find((s) => s.name !== 'OK')
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
