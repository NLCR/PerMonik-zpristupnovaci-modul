import { Box, createStyles, SimpleGrid, Text, Title } from '@mantine/core'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import useMetaTitlesWithStatsQuery from '../api/query/useMetaTitlesWithStatsQuery'
import Loader from '../components/reusableComponents/Loader'
import ShowError from '../components/reusableComponents/ShowError'
import { formatDateToString } from '../utils/helperFunctions'
// import { useSpecimensOverviewStore } from '../slices/useSpecimensOverviewStore'

const useStyles = createStyles((theme) => ({
  card: {
    color: theme.colors.dark[9],
    textDecoration: 'none',
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
  const { data, isLoading, isError } = useMetaTitlesWithStatsQuery()
  // const { resetAll } = useSpecimensOverviewStore()

  return (
    <Box sx={{ textAlign: 'center' }}>
      <Title order={1} color="blue.9">
        {t('home.title')}
      </Title>
      <Text>{t('home.description')}</Text>
      {isLoading ? <Loader /> : null}
      {isError && !isLoading ? <ShowError /> : null}
      {data ? (
        <SimpleGrid mt={50} cols={4}>
          {data.map((mt) => (
            <Link
              to={`${t('urls.specimens_overview')}/${mt.id}`}
              key={mt.id}
              className={classes.card}
              // onClick={() => resetAll()}
            >
              <Title order={5}>{mt.name}</Title>
              {mt.specimens.publicationDayMin &&
              mt.specimens.publicationDayMax ? (
                <Text fz="xs" color="dimmed">
                  {formatDateToString(mt.specimens.publicationDayMin)} -{' '}
                  {formatDateToString(mt.specimens.publicationDayMax)}
                </Text>
              ) : null}
              <SimpleGrid cols={2} mt={20}>
                {/* <Text fz="sm" color="blue.9"> */}
                {/*  {t('home.records')}: {mt.specimens.groupedSpecimens} */}
                {/* </Text> */}
                <Text fz="sm" color="blue.9">
                  {t('home.specimens')}: {mt.specimens.matchedSpecimens}
                </Text>
                <Text fz="sm">
                  {t('home.mutations')}: {mt.specimens.mutationsCount}
                </Text>
                <Text fz="sm">
                  {t('home.owners')}: {mt.specimens.ownersCount}
                </Text>
              </SimpleGrid>
            </Link>
          ))}
        </SimpleGrid>
      ) : null}
    </Box>
  )
}

export default Home
