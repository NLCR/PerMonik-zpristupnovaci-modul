import { createStyles, Flex, rem, Table, Text, Title } from '@mantine/core'
import { IconExternalLink, IconFileSymlink } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import React, { FC } from 'react'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
import { modals } from '@mantine/modals'
import { TSpecimen } from '../../@types/specimen'
import { owners } from '../../utils/constants'
import { useTranslatedConstants } from '../../utils/helperHooks'
import VolumeOverviewStatsModal from '../reusableComponents/VolumeOverviewStatsModal'

const useStyles = createStyles((theme) => ({
  link: {
    // marginLeft: rem(3),
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    color: theme.colors.blue[5],
    // cursor: 'pointer',
    transition: 'color 0.1s',
    ':hover': {
      color: theme.colors.blue[9],
    },
  },
  linkImage: {
    marginLeft: rem(3),
  },
  shortedWidth: {
    maxWidth: rem(300),
  },
}))

type TProps = {
  row: TSpecimen[]
  day: string
}

const CalendarModal: FC<TProps> = ({ row, day }) => {
  const navigate = useNavigate()
  const { classes } = useStyles()
  const { t, i18n } = useTranslation()
  const { publications, mutations } = useTranslatedConstants()

  return (
    <Flex direction="column">
      <Title order={4} mb={5}>
        {t('specimens_overview.date')}
      </Title>
      <Text mb={20}>{dayjs(day).format('dddd DD.MM.YYYY')}</Text>
      <Title order={4} mb={5}>
        {t('specimens_overview.specimens')}
      </Title>
      <Table>
        <thead>
          <tr>
            <th>{t('specimens_overview.mutation')}</th>
            <th>{t('specimens_overview.publication')}</th>
            <th>{t('specimens_overview.name')}</th>
            <th>{t('specimens_overview.sub_name')}</th>
            <th>{t('specimens_overview.owner')}</th>
            <th>{t('specimens_overview.digitization')}</th>
            <th>{t('specimens_overview.volume_overview_modal_link')}</th>
            <th>{t('specimens_overview.volume_detail_link')}</th>
          </tr>
        </thead>
        <tbody>
          {row.map((s) => (
            <tr key={s.id}>
              <td>
                {mutations.find((m) => m.id === Number(s.mutation))?.name}
              </td>
              <td>
                {publications.find((p) => p.id === Number(s.publication))?.name}
              </td>
              <td>{s.name}</td>
              <td className={classes.shortedWidth}>{s.subName}</td>
              <td>
                <a
                  href={`https://www.knihovny.cz/Search/Results?lookfor=${s.barCode}&type=AllFields&limit=20`}
                  target="_blank"
                  rel="noreferrer"
                  className={classes.link}
                >
                  {owners.find((o) => o.id === Number(s.owner))?.name}{' '}
                  <IconExternalLink size={18} className={classes.linkImage} />
                </a>
              </td>
              <td />
              <td>
                <Text
                  className={classes.link}
                  onClick={() => {
                    modals.open({
                      centered: true,
                      size: 'auto',
                      title: (
                        <Text
                          sx={(theme) => ({
                            color: theme.colors.blue[9],
                            fontSize: theme.fontSizes.xl,
                            fontWeight: 'bold',
                          })}
                        >
                          {t('specimens_overview.volume_overview_modal_link')}
                        </Text>
                      ),
                      children: (
                        <VolumeOverviewStatsModal volumeBarCode={s.barCode} />
                      ),
                    })
                  }}
                >
                  {t('specimens_overview.open')}
                  <IconFileSymlink className={classes.linkImage} size={18} />
                </Text>
              </td>
              <td>
                <Text
                  onClick={() => {
                    modals.closeAll()
                    setTimeout(() => {
                      navigate(
                        `/${i18n.resolvedLanguage}/${t(
                          'urls.volume_overview'
                        )}/${s.barCode}`
                      )
                    }, 100)
                  }}
                  className={classes.link}
                >
                  {s.barCode}{' '}
                  <IconFileSymlink size={18} className={classes.linkImage} />
                </Text>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Flex>
  )
}

export default CalendarModal
