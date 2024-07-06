import { useQuery } from '@tanstack/react-query'
import { api } from './index'
import { TMetaTitle, TMetaTitleOverview } from '../@types/metaTitle'

export const useMetaTitleQuery = (id: string) =>
  useQuery({
    queryKey: ['metatitle', id],
    queryFn: () => api().get(`metatitle/${id}`).json<TMetaTitle>(),
  })

export const useMetaTitleOverviewListQuery = () =>
  useQuery({
    queryKey: ['metatitle', 'list'],
    queryFn: () => api().get('metatitle/list/all').json<TMetaTitleOverview[]>(),
  })
