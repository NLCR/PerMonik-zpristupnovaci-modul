import { useQuery } from '@tanstack/react-query'
import { api } from '../index'
import { TVolumeOverviewStats } from '../../@types/volume'

const useVolumeOverviewStatsQuery = (id: string) =>
  useQuery({
    queryKey: ['volume-stats', id],
    queryFn: () =>
      api().get(`v1/volume/stats/${id}`).json<TVolumeOverviewStats | null>(),
  })

export default useVolumeOverviewStatsQuery
