import { useMutation, useQuery } from '@tanstack/react-query'
import { api, queryClient } from './index'
import { TUser } from '../schema/user'

export const useMeQuery = () => {
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
              firstName: 'Petr',
              lastName: 'Šťastný',
              owners: ['1', '2'],
              role: 'admin',
              userName: 'stastny',
            })
          })
        : api().get(`user/me`).json<TUser>()
    },
  })
}

export const useUpdateUserMutation = () =>
  useMutation({
    mutationFn: (user: TUser) =>
      api().put(`user/${user.id}`, { json: user }).json<void>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

export const useUserListQuery = () =>
  useQuery({
    queryKey: ['user', 'list'],
    queryFn: () => api().get(`user/list/all`).json<TUser[]>(),
  })
