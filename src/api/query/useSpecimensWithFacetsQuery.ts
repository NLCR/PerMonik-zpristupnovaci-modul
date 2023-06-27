import { useQuery } from '@tanstack/react-query'
import { api } from '../index'
import {
  TSpecimen,
  TSpecimensFacets,
  TSpecimensPublicationDays,
} from '../../@types/specimen'

export interface TSpecimensWithFacets extends TSpecimensPublicationDays {
  specimens: TSpecimen[]
  facets: TSpecimensFacets
  count: number
}

type TInput = {
  idTitle: string
  dateStart: number
  dateEnd: number
  volume: string
  pageIndex: number
  pageSize: number
}

const useSpecimensWithFacetsQuery = ({
  idTitle,
  dateStart,
  dateEnd,
  volume,
  pageIndex,
  pageSize,
}: TInput) =>
  useQuery(
    ['specimens', idTitle, dateStart, dateEnd, volume, pageIndex, pageSize],
    () => {
      const formData = new FormData()
      formData.set('offset', pageIndex.toString())
      formData.set('rows', pageSize.toString())
      if (dateStart > 0 && dateEnd > 0) {
        formData.set('dateStart', dateStart.toString())
        formData.set('dateEnd', dateEnd.toString())
      }

      return api()
        .post(`v1/specimen/${idTitle}`, {
          body: formData,
        })
        .json<TSpecimensWithFacets>()
    },
    { keepPreviousData: true }
  )

export default useSpecimensWithFacetsQuery
