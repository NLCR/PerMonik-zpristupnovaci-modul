import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  Checkbox,
  createStyles,
  Flex,
  rem,
  ScrollArea,
  Table,
  Title,
} from '@mantine/core'
import React, { Suspense, useEffect, useState } from 'react'
import useVolumeDetailQuery from '../api/query/useVolumeDetailQuery'
import Loader from '../components/reusableComponents/Loader'
import ShowError from '../components/reusableComponents/ShowError'
import ShowInfoMessage from '../components/reusableComponents/ShowInfoMessage'
import { owners } from '../utils/constants'
import { formatDateWithDashesToString } from '../utils/helperFunctions'
import { useTranslatedConstants } from '../utils/helperHooks'

const SpecimensTable = React.lazy(
  () => import('../components/volumeOverview/Table')
)

const useStyles = createStyles((theme) => ({
  borderBottomNone: {
    borderBottom: 'none !important',
  },
  verticalText: { writingMode: 'vertical-lr' },
  header: {
    position: 'sticky',
    top: 0,
    backgroundColor:
      theme.colorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
    transition: 'box-shadow 150ms ease',
    zIndex: 2,
    '&::after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0,
      borderBottom: `${rem(1)} solid ${
        theme.colorScheme === 'dark'
          ? theme.colors.dark[3]
          : theme.colors.gray[2]
      }`,
    },
  },
  scrolled: {
    boxShadow: theme.shadows.sm,
  },
}))

const VolumeOverview = () => {
  const { classes, cx } = useStyles()
  const { volumeId } = useParams()
  const { t } = useTranslation()
  const { publications, mutations } = useTranslatedConstants()
  const [showTable, setShowTable] = useState(false)
  const [inputDataScrolled, setInputDataScrolled] = useState(false)
  const [dailyReleasesScrolled, setDailyReleasesScrolled] = useState(false)
  const {
    data: volume,
    isLoading: volumeLoading,
    isError: volumeError,
  } = useVolumeDetailQuery(volumeId as string)

  useEffect(() => {
    if (volume) {
      setShowTable(true)
    }
  }, [volume])

  if (volumeLoading) return <Loader />
  if (volumeError) return <ShowError />
  if (!volume)
    return <ShowInfoMessage message={t('volume_overview.not_found')} />

  return (
    <Flex
      sx={{
        alignItems: 'stretch',
        justifyContent: 'space-between',
      }}
    >
      <Flex
        direction="column"
        sx={() => ({
          width: '35%',
          maxHeight: '80vh',
          justifyContent: 'space-between',
        })}
      >
        <Flex
          direction="column"
          sx={(theme) => ({
            maxHeight: '49%',
            padding: theme.spacing.md,
            backgroundColor: 'white',
            borderRadius: theme.spacing.xs,
            boxShadow: theme.shadows.xs,
          })}
        >
          <Title
            order={5}
            sx={(theme) => ({
              marginBottom: theme.spacing.xs,
              color: theme.colors.blue[9],
            })}
          >
            {t('volume_overview.input_data')}
          </Title>
          <ScrollArea
            onScrollPositionChange={({ y }) => setInputDataScrolled(y !== 0)}
          >
            <Table verticalSpacing="xs" fontSize="xs">
              <thead
                className={cx(classes.header, {
                  [classes.scrolled]: inputDataScrolled,
                })}
              >
                <tr>
                  <th className={classes.borderBottomNone}>
                    {t('volume_overview.name')}
                  </th>
                  <th className={classes.borderBottomNone}>
                    {t('volume_overview.value')}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>{t('volume_overview.meta_title')}</td>
                  <td>{volume.metaTitle.name}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.mutation')}</td>
                  <td>
                    {
                      mutations.find(
                        (m) => m.id === Number(volume.volume.mutation)
                      )?.name
                    }
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.publication_mark')}</td>
                  <td>{volume.volume.publicationMark}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.bar_code')}</td>
                  <td>{volume.volume.barCode}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.signature')}</td>
                  <td>{volume.volume.signature}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.year')}</td>
                  <td>{volume.volume.year}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.date_from')}</td>
                  <td>
                    {formatDateWithDashesToString(volume.volume.dateFrom)}
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.date_to')}</td>
                  <td>{formatDateWithDashesToString(volume.volume.dateTo)}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.first_number')}</td>
                  <td>{volume.volume.firstNumber}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.last_number')}</td>
                  <td>{volume.volume.lastNumber}</td>
                </tr>
                <tr>
                  <td>{t('volume_overview.owner')}</td>
                  <td>
                    {
                      owners.find((o) => o.id === Number(volume.volume.owner))
                        ?.name
                    }
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.note')}</td>
                  <td>{volume.volume.note}</td>
                </tr>
              </tbody>
            </Table>
          </ScrollArea>
          {/* </Flex> */}
        </Flex>
        <Flex
          direction="column"
          sx={(theme) => ({
            maxHeight: '49%',
            padding: theme.spacing.md,
            backgroundColor: 'white',
            borderRadius: theme.spacing.xs,
            boxShadow: theme.shadows.xs,
            // maxHeight: '400px',
          })}
        >
          <Title
            order={5}
            sx={(theme) => ({
              marginBottom: theme.spacing.xs,
              color: theme.colors.blue[9],
            })}
          >
            {t('volume_overview.daily_releases')}
          </Title>
          <ScrollArea
            onScrollPositionChange={({ y }) =>
              setDailyReleasesScrolled(y !== 0)
            }
          >
            <Table verticalSpacing="xs" fontSize="xs">
              <thead
                className={cx(classes.header, {
                  [classes.scrolled]: dailyReleasesScrolled,
                })}
              >
                <tr>
                  <th>{t('volume_overview.releasing')}</th>
                  <th>{t('volume_overview.is_in_volume')}</th>
                  <th>{t('volume_overview.publication')}</th>
                  <th>{t('volume_overview.pages_count')}</th>
                  <th>{t('volume_overview.name')}</th>
                  <th>{t('volume_overview.sub_name')}</th>
                </tr>
              </thead>
              <tbody>
                {volume.volume.periodicity.map((p) => (
                  <tr key={p.day}>
                    <td>{t(`volume_overview.days.${p.day}`)}</td>
                    <td>
                      <Checkbox checked={p.active} readOnly />
                    </td>
                    <td>
                      {
                        publications.find(
                          (pb) => pb.id === Number(p.publication)
                        )?.name
                      }
                    </td>
                    <td>{p.pagesCount}</td>
                    <td>{p.name}</td>
                    <td>{p.subName}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </ScrollArea>
        </Flex>
      </Flex>

      <Flex
        direction="column"
        sx={(theme) => ({
          height: '100%',
          maxHeight: '80vh',
          padding: theme.spacing.md,
          backgroundColor: 'white',
          borderRadius: theme.spacing.xs,
          boxShadow: theme.shadows.xs,
          width: '64%',
        })}
      >
        <Title
          order={5}
          sx={(theme) => ({
            marginBottom: theme.spacing.xs,
            color: theme.colors.blue[9],
          })}
        >
          {t('volume_overview.volume_description')}
        </Title>
        {showTable ? (
          <Suspense fallback={<Loader />}>
            <SpecimensTable volume={volume} />
          </Suspense>
        ) : (
          <Loader />
        )}
      </Flex>
    </Flex>
  )
}

export default VolumeOverview
