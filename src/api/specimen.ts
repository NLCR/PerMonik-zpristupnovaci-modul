import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import dayjs from 'dayjs'
import { api } from './index'
import {
  TSpecimen,
  TSpecimensFacets,
  TSpecimensPublicationDays,
} from '../@types/specimen'
import { useSpecimensOverviewStore } from '../slices/useSpecimensOverviewStore'

export interface TSpecimenFacets extends TSpecimensFacets {}

export const useSpecimenFacetsQuery = (idTitle: string, enabled: boolean) => {
  const { params, barCodeInput } = useSpecimensOverviewStore()
  const [debouncedBarCodeInput] = useDebouncedValue(barCodeInput, 400)

  return useQuery({
    queryKey: ['specimen', 'facets', idTitle, params, debouncedBarCodeInput],
    queryFn: () => {
      const formData = new FormData()
      formData.set(
        'facets',
        JSON.stringify({
          ...params,
          barCode: debouncedBarCodeInput.trim().replaceAll(' ', ''),
        })
      )

      return api()
        .post(`specimen/${idTitle}/list/facets`, {
          body: formData,
        })
        .json<TSpecimenFacets>()
    },
    placeholderData: keepPreviousData,
    enabled,
  })
}

export interface TSpecimenList extends TSpecimensPublicationDays {
  specimens: TSpecimen[]
  count: number
}

export const useSpecimenListQuery = (idTitle: string, enabled: boolean) => {
  const { params, pagination, barCodeInput, view, calendarDate } =
    useSpecimensOverviewStore()
  const [debouncedBarCodeInput] = useDebouncedValue(barCodeInput, 400)

  return useQuery({
    queryKey: [
      'specimen',
      'list',
      view,
      idTitle,
      pagination.pageIndex,
      pagination.pageSize,
      params,
      calendarDate,
      debouncedBarCodeInput,
    ],
    queryFn: () => {
      const dayJsDate = dayjs(calendarDate)
      const startOfMonth = dayJsDate.startOf('month')
      const endOfMonth = dayJsDate.endOf('month')

      const formData = new FormData()
      if (view === 'table') {
        formData.set(
          'offset',
          (pagination.pageIndex > 0
            ? pagination.pageIndex * pagination.pageSize + 1
            : pagination.pageIndex * pagination.pageSize
          ).toString()
        )
        formData.set('rows', pagination.pageSize.toString())
      } else {
        formData.set('offset', '0')
        formData.set('rows', '1000')
      }
      formData.set(
        'facets',
        JSON.stringify({
          ...params,
          barCode: debouncedBarCodeInput.trim().replaceAll(' ', ''),
          calendarDateStart: startOfMonth,
          calendarDateEnd: endOfMonth,
        })
      )
      formData.set('view', view)

      return api()
        .post(`specimen/${idTitle}/list`, {
          body: formData,
        })
        .json<TSpecimenList>()
    },
    placeholderData: keepPreviousData,
    // enabled:
    //   enabled &&
    //   (view === 'table' || (view === 'calendar' && calendarDate !== undefined)),
    enabled,
  })
}

export const useSpecimensStartDateForCalendar = (
  id: string,
  enabled: boolean
) => {
  return useQuery({
    queryKey: ['specimen', 'date', id],
    queryFn: () => api().get(`specimen/${id}/start-date`).json<number>(),
    enabled,
  })
}
