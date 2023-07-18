import { createStyles, Flex, rem, Table, Title } from '@mantine/core'
import { IconExternalLink } from '@tabler/icons-react'
import { useTranslation } from 'react-i18next'
import { FC } from 'react'
import { TSpecimen } from '../../@types/specimen'
import { owners } from '../../utils/constants'
import { useTranslatedConstants } from '../../utils/helperHooks'

const useStyles = createStyles((theme) => ({
  link: {
    // marginLeft: rem(3),
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
}

const Modal: FC<TProps> = ({ row }) => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const { publications, mutations } = useTranslatedConstants()

  return (
    <Flex direction="column">
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
                  <IconExternalLink size={15} className={classes.linkImage} />
                </a>
              </td>
              <td />
            </tr>
          ))}
        </tbody>
      </Table>
    </Flex>
  )
}

export default Modal
