import { useMutation, useQuery } from '@tanstack/react-query'
import clone from 'lodash/clone'
import { api, queryClient } from './index'
import { TEditableOwner, TOwner } from '../schema/owner'

export const useOwnerListQuery = () => {
  return useQuery({
    queryKey: ['owner', 'list', 'all'],
    queryFn: () => api().get(`owner/list/all`).json<TOwner[]>(),
  })
}

export const useUpdateOwnerMutation = () =>
  useMutation({
    mutationFn: (owner: TEditableOwner) => {
      const ownerClone = clone(owner)
      ownerClone.name = ownerClone.name.trim()
      ownerClone.sigla = ownerClone.sigla.trim()

      return api()
        .put(`owner/${ownerClone.id}`, { json: ownerClone })
        .json<void>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'list'] })
    },
  })

export const useCreateOwnerMutation = () =>
  useMutation({
    mutationFn: (owner: TEditableOwner) => {
      const ownerClone = clone(owner)
      ownerClone.name = ownerClone.name.trim()
      ownerClone.sigla = ownerClone.sigla.trim()

      return api().post(`owner`, { json: ownerClone }).json<void>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owner', 'list'] })
    },
  })
