import { useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  createStyles,
  Flex,
  rem,
  ScrollArea,
  Table,
  Title,
} from '@mantine/core'
import { Box } from '@mui/material'
import React, { useState } from 'react'
import dayjs from 'dayjs'
import { usePublicVolumeDetailQuery } from '../../api/volume'
import Loader from '../../components/Loader'
import ShowError from '../../components/ShowError'
import ShowInfoMessage from '../../components/ShowInfoMessage'
import { useLanguageCode } from '../../utils/helperHooks'
import { useMutationListQuery } from '../../api/mutation'
import { useOwnerListQuery } from '../../api/owner'
import SpecimensTable from './components/Table'
import { useMetaTitleListQuery } from '../../api/metaTitle'

const useStyles = createStyles((theme) => ({
  borderBottomNone: {
    borderBottom: 'none !important',
  },
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
  const {
    data: mutations,
    isLoading: mutationsLoading,
    isError: mutationsError,
  } = useMutationListQuery()
  const {
    data: owners,
    isLoading: ownersLoading,
    isError: ownersError,
  } = useOwnerListQuery()
  const { languageCode } = useLanguageCode()
  const [inputDataScrolled, setInputDataScrolled] = useState(false)
  const {
    data: volume,
    isLoading: volumeLoading,
    isError: volumeError,
  } = usePublicVolumeDetailQuery(volumeId)
  const {
    data: metaTitles,
    isLoading: metaTitlesLoading,
    isError: metaTitlesError,
  } = useMetaTitleListQuery()

  if (volumeLoading || mutationsLoading || ownersLoading || metaTitlesLoading)
    return <Loader />
  if (volumeError || mutationsError || ownersError || metaTitlesError)
    return <ShowError />
  if (!volume || !mutations || !owners || !metaTitles)
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
          // width: '35%',
          width: '23%',
          maxHeight: '80vh',
          justifyContent: 'space-between',
        })}
      >
        <Flex
          direction="column"
          sx={(theme) => ({
            // maxHeight: '49%',
            height: '100%',
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
            {t('volume_overview.volume_information')}
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
                  <td>
                    {
                      metaTitles.find((m) => m.id === volume.volume.metaTitleId)
                        ?.name
                    }
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.mutation')}</td>
                  <td>
                    {
                      mutations.find((m) => m.id === volume.volume.mutationId)
                        ?.name[languageCode]
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
                    {dayjs(volume.volume.dateFrom).format('DD. MMMM YYYY')}
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.date_to')}</td>
                  <td>{dayjs(volume.volume.dateTo).format('DD. MMMM YYYY')}</td>
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
                    {owners.find((o) => o.id === volume.volume.ownerId)?.name}
                  </td>
                </tr>
                <tr>
                  <td>{t('volume_overview.note')}</td>
                  <td>{volume.volume.note}</td>
                </tr>
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
          // width: '64%',
          width: '76%',
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
        <SpecimensTable volume={volume} />
      </Flex>
    </Flex>
  )
}

export default VolumeOverview
