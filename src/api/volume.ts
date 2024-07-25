import { useMutation, useQuery } from '@tanstack/react-query'
import { api, queryClient } from './index'
import { TVolume, TVolumeDetail, TVolumeOverviewStats } from '../schema/volume'
import { TSpecimen } from '../schema/specimen'

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

type TUpdatableVolume = {
  volume: TVolume
  specimens: TSpecimen[]
}

export const useCreateVolumeWithSpecimensMutation = () =>
  useMutation<string, unknown, TUpdatableVolume>({
    mutationFn: (data) => {
      return api()
        .post(`volume`, {
          json: {
            volume: {
              ...data.volume,
              // JSON.stringify periodicity, because solr stores periodicity as String
              periodicity: JSON.stringify(data.volume.periodicity),
            },
            specimens: data.specimens,
          },
        })
        .json<string>()
    },
  })

export const useUpdateVolumeWithSpecimensMutation = () =>
  useMutation<void, unknown, TUpdatableVolume>({
    mutationFn: (data) => {
      return api()
        .put(`volume/${data.volume.id}`, {
          json: {
            volume: {
              ...data.volume,
              // JSON.stringify periodicity, because solr stores periodicity as String
              periodicity: JSON.stringify(data.volume.periodicity),
            },
            specimens: data.specimens,
          },
        })
        .json<void>()
    },
    onSuccess: (_, editArgs) => {
      queryClient.invalidateQueries({
        queryKey: ['volume', 'detail', editArgs.volume.id],
      })
    },
  })

export const useUpdateRegeneratedVolumeWithSpecimensMutation = () =>
  useMutation<void, unknown, TUpdatableVolume>({
    mutationFn: (data) => {
      return api()
        .put(`volume/${data.volume.id}/regenerated`, {
          json: {
            volume: {
              ...data.volume,
              // JSON.stringify periodicity, because solr stores periodicity as String
              periodicity: JSON.stringify(data.volume.periodicity),
            },
            specimens: data.specimens,
          },
        })
        .json<void>()
    },
    onSuccess: (_, editArgs) => {
      queryClient.invalidateQueries({
        queryKey: ['volume', 'detail', editArgs.volume.id],
      })
    },
  })
