import { useMutation, useQuery } from '@tanstack/react-query'
import { api, queryClient } from './index'
import { TEditableOwner, TOwner } from '../schema/owner'

export const useOwnerListQuery = () => {
  return useQuery({
    queryKey: ['owner', 'list'],
    queryFn: () => api().get(`owner/list/all`).json<TOwner[]>(),
  })
}

export const useUpdateOwnerMutation = () =>
  useMutation({
    mutationFn: (owner: TEditableOwner) =>
      api().put(`owner/${owner.id}`, { json: owner }).json<void>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'list'] })
    },
  })

export const useCreateOwnerMutation = () =>
  useMutation({
    mutationFn: (owner: TEditableOwner) =>
      api().post(`owner`, { json: owner }).json<void>(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'list'] })
    },
  })
