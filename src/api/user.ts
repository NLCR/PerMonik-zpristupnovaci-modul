import { useMutation, useQuery } from '@tanstack/react-query'
import { clone } from 'lodash-es'
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
              owners: [
                'cd2449f8-4c74-46fd-9557-ed0a9162407c',
                'fc1c2ff3-7e86-475e-83dd-3190cae113f2',
              ],
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
    mutationFn: (user: TUser) => {
      const userClone = clone(user)
      userClone.email = user.email.trim()
      userClone.userName = user.userName.trim()
      userClone.firstName = user.firstName.trim()
      userClone.lastName = user.lastName.trim()

      return api().put(`user/${userClone.id}`, { json: userClone }).json<void>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
    },
  })

export const useUserListQuery = () =>
  useQuery({
    queryKey: ['user', 'list', 'all'],
    queryFn: () => api().get(`user/list/all`).json<TUser[]>(),
  })
