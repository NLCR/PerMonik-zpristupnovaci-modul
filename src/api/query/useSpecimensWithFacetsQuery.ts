import { useQuery } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import dayjs from 'dayjs'
import { api } from '../index'
import {
  TSpecimen,
  TSpecimensFacets,
  TSpecimensPublicationDays,
} from '../../@types/specimen'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'

export interface TSpecimensWithFacets extends TSpecimensPublicationDays {
  specimens: TSpecimen[]
  facets: TSpecimensFacets
  count: number
}

const useSpecimensWithFacetsQuery = (idTitle: string, enabled: boolean) => {
  const { params, pagination, volumeInput, view, calendarDate } =
    useSpecimensOverviewStore()
  const [debouncedVolumeInput] = useDebouncedValue(volumeInput, 400)

  return useQuery(
    [
      'specimens',
      view,
      idTitle,
      pagination.pageIndex,
      pagination.pageSize,
      params,
      calendarDate,
      debouncedVolumeInput,
    ],
    () => {
      const dayJsDate = dayjs(calendarDate)
      const startOfMonth = dayJsDate.startOf('month')
      const endOfMonth = dayJsDate.endOf('month')

      const formData = new FormData()
      if (view === 'table') {
        formData.set('offset', pagination.pageIndex.toString())
        formData.set('rows', pagination.pageSize.toString())
      } else {
        formData.set('offset', '0')
        formData.set('rows', '10000000')
      }
      formData.set(
        'facets',
        JSON.stringify({
          ...params,
          volume: debouncedVolumeInput.trim().replaceAll(' ', ''),
          calendarDateStart: startOfMonth,
          calendarDateEnd: endOfMonth,
        })
      )
      formData.set('view', view)

      return api()
        .post(`v1/specimen/${idTitle}`, {
          body: formData,
        })
        .json<TSpecimensWithFacets>()
    },
    {
      keepPreviousData: true,
      enabled:
        enabled &&
        (view === 'table' ||
          (view === 'calendar' && calendarDate !== undefined)),
    }
  )
}

export default useSpecimensWithFacetsQuery
