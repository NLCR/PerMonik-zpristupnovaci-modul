import { useQuery } from '@tanstack/react-query'
import { api } from '../index'

const useSpecimensStartDateForCalendar = (id: string, enabled: boolean) =>
  useQuery(
    ['specimens-start-date', id],
    () => api().get(`v1/specimen/start_date/${id}`).json<number>(),
    {
      enabled,
    }
  )

export default useSpecimensStartDateForCalendar
