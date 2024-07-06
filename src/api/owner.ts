import { useQuery } from '@tanstack/react-query'
import { api } from './index'
import { TOwner } from '../@types/owner'

// eslint-disable-next-line import/prefer-default-export
export const useOwnerListQuery = () => {
  return useQuery({
    queryKey: ['owner', 'list'],
    queryFn: () => api().get(`owner/list/all`).json<TOwner[]>(),
  })
}
