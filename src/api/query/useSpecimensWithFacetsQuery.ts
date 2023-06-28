import { useQuery } from '@tanstack/react-query'
import { api } from '../index'
import {
  TSpecimen,
  TSpecimensFacets,
  TSpecimensPublicationDays,
} from '../../@types/specimen'
import type { TParams } from '../../pages/SpecimensOverview'

export interface TSpecimensWithFacets extends TSpecimensPublicationDays {
  specimens: TSpecimen[]
  facets: TSpecimensFacets
  count: number
}

type TInput = {
  idTitle: string
  params: TParams
  pageIndex: number
  pageSize: number
  volume: string
}

const useSpecimensWithFacetsQuery = ({
  idTitle,
  params,
  pageIndex,
  pageSize,
  volume,
}: TInput) =>
  useQuery(
    ['specimens', idTitle, pageIndex, pageSize, params, volume],
    () => {
      const formData = new FormData()
      formData.set('offset', pageIndex.toString())
      formData.set('rows', pageSize.toString())
      formData.set('facets', JSON.stringify({ ...params, volume }))

      return api()
        .post(`v1/specimen/${idTitle}`, {
          body: formData,
        })
        .json<TSpecimensWithFacets>()
    },
    { keepPreviousData: true }
  )

export default useSpecimensWithFacetsQuery
