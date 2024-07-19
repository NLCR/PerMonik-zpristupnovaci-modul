import { useQuery } from '@tanstack/react-query'
import { api } from './index'
import { TVolumeDetail, TVolumeOverviewStats } from '../schema/volume'

export const useMangedVolumeDetailQuery = (id?: string) =>
  useQuery({
    queryKey: ['volume', 'detail', id],
    queryFn: () =>
      api().get(`volume/${id}/detail`).json<TVolumeDetail | null>(),
    enabled: !!id,
  })

export const usePublicVolumeDetailQuery = (id?: string) =>
  useQuery({
    queryKey: ['volume', 'detail', 'public', id],
    queryFn: () =>
      api().get(`volume/${id}/detail/public`).json<TVolumeDetail | null>(),
    enabled: !!id,
  })

export const useVolumeOverviewStatsQuery = (id?: string) =>
  useQuery({
    queryKey: ['volume', 'stats', id],
    queryFn: () =>
      api().get(`volume/${id}/stats`).json<TVolumeOverviewStats | null>(),
    enabled: !!id,
  })
