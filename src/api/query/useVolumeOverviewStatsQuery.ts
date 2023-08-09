import { useQuery } from '@tanstack/react-query'
import { api } from '../index'
import { TVolumeOverviewStats } from '../../@types/volume'

const useVolumeOverviewStatsQuery = (id: string) =>
  useQuery(['volume-stats', id], () =>
    api().get(`v1/volume/stats/${id}`).json<TVolumeOverviewStats | null>()
  )

export default useVolumeOverviewStatsQuery
