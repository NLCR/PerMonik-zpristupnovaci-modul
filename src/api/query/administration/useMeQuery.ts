import { useQuery } from '@tanstack/react-query'
import { api } from '../../index'
import { TUser } from '../../../@types/user'

const useMeQuery = () => {
  const useMock = true

  return useQuery({
    queryKey: ['me'],
    queryFn: (): Promise<TUser> => {
      return useMock
        ? new Promise((res) => {
            res({
              id: '098f6bcd4621d373cade4e832627b4f6',
              active: true,
              email: 'stastny@inqool.cz',
              name: 'Petr Šťastný',
              owner: '1,2',
              role: 'admin',
              userName: 'stastny',
              note: null,
            })
          })
        : api().get(`v1/user/me`).json<TUser>()
    },
  })
}
export default useMeQuery
