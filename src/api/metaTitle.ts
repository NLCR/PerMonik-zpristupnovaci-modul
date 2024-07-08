import { useMutation, useQuery } from '@tanstack/react-query'
import { clone } from 'lodash-es'
import { api, queryClient } from './index'
import { TMetaTitleOverview } from '../@types/metaTitle'
import { TMetaTitle, TEditableMetaTitle } from '../schema/metaTitle'

export const useMetaTitleQuery = (id: string) =>
  useQuery({
    queryKey: ['metatitle', id],
    queryFn: () => api().get(`metatitle/${id}`).json<TMetaTitle>(),
  })

export const useMetaTitleOverviewListQuery = () =>
  useQuery({
    queryKey: ['metatitle', 'list', 'overview'],
    queryFn: () =>
      api().get('metatitle/list/overview').json<TMetaTitleOverview[]>(),
  })

export const useMetaTitleListQuery = () =>
  useQuery({
    queryKey: ['metatitle', 'list', 'all'],
    queryFn: () => api().get('metatitle/list/all').json<TMetaTitle[]>(),
  })

export const useUpdateMetaTitleMutation = () =>
  useMutation({
    mutationFn: (metaTitle: TEditableMetaTitle) => {
      const metaTitleClone = clone(metaTitle)
      metaTitleClone.name = metaTitleClone.name.trim()
      metaTitleClone.note = metaTitleClone.note.trim()

      return api()
        .put(`metatitle/${metaTitleClone.id}`, { json: metaTitleClone })
        .json<void>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metatitle', 'list'] })
    },
  })

export const useCreateMetaTitleMutation = () =>
  useMutation({
    mutationFn: (metaTitle: TEditableMetaTitle) => {
      const metaTitleClone = clone(metaTitle)
      metaTitleClone.name = metaTitleClone.name.trim()
      metaTitleClone.note = metaTitleClone.note.trim()

      return api().post(`metatitle`, { json: metaTitleClone }).json<void>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['metatitle', 'list'] })
    },
  })
