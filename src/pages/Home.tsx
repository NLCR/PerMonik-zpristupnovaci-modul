import { Container, createStyles, SimpleGrid, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import useMetaTitlesOverviewQuery from '../api/query/useMetaTitlesOverviewQuery'
import Loader from '../components/reusableComponents/Loader'
import ShowError from '../components/reusableComponents/ShowError'
import { formatDate } from '../utils/helperFunctions'

const useStyles = createStyles((theme) => ({
  card: {
    padding: theme.spacing.md,
    backgroundColor: 'white',
    textAlign: 'left',
    borderRadius: theme.spacing.xs,
    boxShadow: theme.shadows.xs,
    transition: 'all 0.2s',
    ':hover': {
      boxShadow: theme.shadows.sm,
      cursor: 'pointer',
    },
  },
}))

const Home = () => {
  const { classes } = useStyles()
  const { t } = useTranslation()
  const { data, isLoading, isError } = useMetaTitlesOverviewQuery()

  return (
    <Container size="xl" sx={{ textAlign: 'center' }}>
      <Title order={1} color="blue.9">
        {t('home.title')}
      </Title>
      <Text>{t('home.description')}</Text>
      {isLoading ? <Loader /> : null}
      {isError && !isLoading ? <ShowError /> : null}
      {data ? (
        <SimpleGrid mt={50} cols={3}>
          {data.map((mt) => (
            <div key={mt.id} className={classes.card}>
              <Title order={5}>{mt.name}</Title>
              {mt.specimens.publicationDayMin &&
              mt.specimens.publicationDayMax ? (
                <Text fz="xs" color="dimmed">
                  {formatDate(mt.specimens.publicationDayMin)} -{' '}
                  {formatDate(mt.specimens.publicationDayMax)}
                </Text>
              ) : null}
              <SimpleGrid cols={2} mt={20}>
                <Text fz="sm" color="blue.9">
                  {t('home.records')}: {mt.specimens.groupedSpecimens}
                </Text>
                <Text fz="sm">
                  {t('home.specimens')}: {mt.specimens.matchedSpecimens}
                </Text>
                <Text fz="sm">
                  {t('home.mutations')}: {mt.specimens.mutationsCount}
                </Text>
                <Text fz="sm">
                  {t('home.owners')}: {mt.specimens.ownersCount}
                </Text>
              </SimpleGrid>
            </div>
          ))}
        </SimpleGrid>
      ) : null}
    </Container>
  )
}

export default Home
