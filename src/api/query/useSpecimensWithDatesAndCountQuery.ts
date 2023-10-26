import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import dayjs from 'dayjs'
import { api } from '../index'
import { TSpecimen, TSpecimensPublicationDays } from '../../@types/specimen'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'

export interface TSpecimensWithFacets extends TSpecimensPublicationDays {
  specimens: TSpecimen[]
  count: number
}

const useSpecimensWithDatesAndCountQuery = (
  idTitle: string,
  enabled: boolean
) => {
  const { params, pagination, volumeInput, view, calendarDate } =
    useSpecimensOverviewStore()
  const [debouncedVolumeInput] = useDebouncedValue(volumeInput, 400)

  return useQuery({
    queryKey: [
      'specimens',
      view,
      idTitle,
      pagination.pageIndex,
      pagination.pageSize,
      params,
      calendarDate,
      debouncedVolumeInput,
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
    placeholderData: keepPreviousData,
    // enabled:
    //   enabled &&
    //   (view === 'table' || (view === 'calendar' && calendarDate !== undefined)),
    enabled,
  })
}

export default useSpecimensWithDatesAndCountQuery
