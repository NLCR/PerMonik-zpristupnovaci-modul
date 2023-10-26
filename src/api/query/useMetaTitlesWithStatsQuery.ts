import { useQuery } from '@tanstack/react-query'
import { api } from '../index'
import { TMetaTitlesWithStats } from '../../@types/metaTitle'

const useMetaTitlesWithStatsQuery = () =>
  useQuery({
    queryKey: ['metatitles-with-stats'],
    queryFn: () =>
      api().get('v1/metatitle/all/stats').json<TMetaTitlesWithStats[]>(),
  })

export default useMetaTitlesWithStatsQuery
