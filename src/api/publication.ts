import { useMutation, useQuery } from '@tanstack/react-query'
import { clone } from 'lodash-es'
import { api, queryClient } from './index'
import { TEditablePublication, TPublication } from '../schema/publication'

// eslint-disable-next-line import/prefer-default-export
export const usePublicationListQuery = () => {
  return useQuery({
    queryKey: ['publication', 'list', 'all'],
    queryFn: () => api().get(`publication/list/all`).json<TPublication[]>(),
  })
}

export const useUpdatePublicationMutation = () =>
  useMutation({
    mutationFn: (publication: TEditablePublication) => {
      const publicationClone = clone(publication)
      publicationClone.name = {
        cs: publicationClone.name.cs.trim(),
        sk: publicationClone.name.sk.trim(),
        en: publicationClone.name.en.trim(),
      }

      return api()
        .put(`publication/${publicationClone.id}`, {
          // JSON.stringify name, because solr stores name as String
          json: {
            ...publicationClone,
            name: JSON.stringify(publicationClone.name),
          },
        })
        .json<void>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publication', 'list'] })
    },
  })

export const useCreatePublicationMutation = () =>
  useMutation({
    mutationFn: (publication: TEditablePublication) => {
      const publicationClone = clone(publication)
      publicationClone.name = {
        cs: publicationClone.name.cs.trim(),
        sk: publicationClone.name.sk.trim(),
        en: publicationClone.name.en.trim(),
      }

      return api()
        .post(`publication`, {
          // JSON.stringify name, because solr stores name as String
          json: {
            ...publicationClone,
            name: JSON.stringify(publicationClone.name),
          },
        })
        .json<void>()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['publication', 'list'] })
    },
  })
