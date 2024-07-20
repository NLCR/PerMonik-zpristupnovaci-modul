import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useDebounce } from 'use-debounce'
import dayjs from 'dayjs'
import { api } from './index'
import {
  TSpecimen,
  TSpecimensFacets,
  TSpecimensPublicationDays,
} from '../@types/specimen'
import { useSpecimensOverviewStore } from '../slices/useSpecimensOverviewStore'

export interface TSpecimenFacets extends TSpecimensFacets {}

export const useSpecimenFacetsQuery = (metaTitleId?: string) => {
  const { params, barCodeInput } = useSpecimensOverviewStore()
  const [debouncedBarCodeInput] = useDebounce(barCodeInput, 400)

  return useQuery({
    queryKey: [
      'specimen',
      'facets',
      metaTitleId,
      params,
      debouncedBarCodeInput,
    ],
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
        .post(`specimen/${metaTitleId}/list/facets`, {
          body: formData,
        })
        .json<TSpecimenFacets>()
    },
    placeholderData: keepPreviousData,
    enabled: !!metaTitleId,
  })
}

export interface TSpecimenList extends TSpecimensPublicationDays {
  specimens: TSpecimen[]
  count: number
}

export const useSpecimenListQuery = (metaTitleId?: string) => {
  const { params, pagination, barCodeInput, view, calendarDate } =
    useSpecimensOverviewStore()
  const [debouncedBarCodeInput] = useDebounce(barCodeInput, 400)

  return useQuery({
    queryKey: [
      'specimen',
      'list',
      view,
      metaTitleId,
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
        .post(`specimen/${metaTitleId}/list`, {
          body: formData,
        })
        .json<TSpecimenList>()
    },
    placeholderData: keepPreviousData,
    // enabled:
    //   enabled &&
    //   (view === 'table' || (view === 'calendar' && calendarDate !== undefined)),
    enabled: !!metaTitleId,
  })
}

export const useSpecimensStartDateForCalendar = (metaTitleId?: string) => {
  return useQuery({
    queryKey: ['specimen', 'date', metaTitleId],
    queryFn: () =>
      api().get(`specimen/${metaTitleId}/start-date`).json<number>(),
    enabled: !!metaTitleId,
  })
}
