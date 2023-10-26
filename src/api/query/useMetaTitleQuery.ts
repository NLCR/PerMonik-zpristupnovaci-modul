import { useQuery } from '@tanstack/react-query'
import { api } from '../index'
import { TMetaTitle } from '../../@types/metaTitle'

const useMetaTitleQuery = (id: string) =>
  useQuery({
    queryKey: ['metatitle', id],
    queryFn: () => api().get(`v1/metatitle/${id}`).json<TMetaTitle>(),
  })

export default useMetaTitleQuery
