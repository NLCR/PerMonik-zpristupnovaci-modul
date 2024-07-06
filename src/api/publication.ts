import { useQuery } from '@tanstack/react-query'
import { api } from './index'
import { TPublication } from '../@types/publication'

// eslint-disable-next-line import/prefer-default-export
export const usePublicationListQuery = () => {
  return useQuery({
    queryKey: ['publication', 'list'],
    queryFn: () => api().get(`publication/list/all`).json<TPublication[]>(),
  })
}
