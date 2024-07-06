import { useQuery } from '@tanstack/react-query'
import { api } from './index'
import { TVolumeDetail, TVolumeOverviewStats } from '../@types/volume'

export const useVolumeDetailQuery = (id: string) =>
  useQuery({
    queryKey: ['volume', 'detail', id],
    queryFn: () =>
      api().get(`volume/${id}/detail`).json<TVolumeDetail | null>(),
  })

export const useVolumeOverviewStatsQuery = (id: string) =>
  useQuery({
    queryKey: ['volume', 'stats', id],
    queryFn: () =>
      api().get(`volume/${id}/stats`).json<TVolumeOverviewStats | null>(),
  })
