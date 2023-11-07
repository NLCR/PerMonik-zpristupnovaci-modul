import { useQuery } from '@tanstack/react-query'
import { api } from '../../index'
import { TUser } from '../../../@types/user'

const useUsersQuery = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: () => api().get(`v1/user/all`).json<TUser[]>(),
  })

export default useUsersQuery
