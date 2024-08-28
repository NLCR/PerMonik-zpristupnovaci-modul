import { useQuery, keepPreviousData } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { api } from './index'
import {
  TSpecimensPublicationDays,
  TSpecimen,
  TSpecimenDamageTypesFacet,
  TSpecimenFacet,
} from '../schema/specimen'
import { useSpecimensOverviewStore } from '../slices/useSpecimensOverviewStore'

interface TSpecimensFacets {
  names: TSpecimenFacet[]
  subNames: TSpecimenFacet[]
  mutationIds: TSpecimenFacet[]
  publicationIds: TSpecimenFacet[]
  publicationMarks: TSpecimenFacet[]
  ownerIds: TSpecimenFacet[]
  damageTypes: TSpecimenDamageTypesFacet[]
}

export const useSpecimenFacetsQuery = (metaTitleId?: string) => {
  const params = useSpecimensOverviewStore((state) => state.params)
  const barCodeInput = useSpecimensOverviewStore((state) => state.barCodeInput)
  const view = useSpecimensOverviewStore((state) => state.view)

  return useQuery({
    queryKey: ['specimen', 'facets', metaTitleId, params, barCodeInput, view],
    queryFn: () => {
      const formData = new FormData()
      formData.set(
        'facets',
        JSON.stringify({
          ...params,
          barCode: barCodeInput,
        })
      )
      formData.set('view', view)

      return api()
        .post(`specimen/${metaTitleId}/list/facets`, {
          body: formData,
        })
        .json<TSpecimensFacets>()
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
  const params = useSpecimensOverviewStore((state) => state.params)
  const pagination = useSpecimensOverviewStore((state) => state.pagination)
  const barCodeInput = useSpecimensOverviewStore((state) => state.barCodeInput)
  const calendarDate = useSpecimensOverviewStore((state) => state.calendarDate)
  const view = useSpecimensOverviewStore((state) => state.view)

  const dayJsDate = dayjs(calendarDate)

  const startOfMonth = dayJsDate.startOf('month')
  const endOfMonth = dayJsDate.endOf('month')

  const startOfMonthUTC = `${startOfMonth.year()}-${String(startOfMonth.month() + 1).padStart(2, '0')}-01T00:00:00.000Z`
  const endOfMonthUTC = `${endOfMonth.year()}-${String(endOfMonth.month() + 1).padStart(2, '0')}-${String(endOfMonth.date()).padStart(2, '0')}T23:59:59.999Z`

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
      barCodeInput,
    ],
    queryFn: () => {
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
          barCode: barCodeInput,
          calendarDateStart: startOfMonthUTC,
          calendarDateEnd: endOfMonthUTC,
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
