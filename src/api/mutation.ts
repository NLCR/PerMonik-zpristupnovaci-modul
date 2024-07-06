import { useQuery } from '@tanstack/react-query'
import { api } from './index'
import { TMutation } from '../@types/mutation'

// eslint-disable-next-line import/prefer-default-export
export const useMutationListQuery = () => {
  return useQuery({
    queryKey: ['mutation', 'list'],
    queryFn: () => api().get(`mutation/list/all`).json<TMutation[]>(),
  })
}
