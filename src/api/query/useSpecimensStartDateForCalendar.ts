import { useQuery } from '@tanstack/react-query'
import { api } from '../index'

const useSpecimensStartDateForCalendar = (id: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['specimens-start-date', id],
    queryFn: () => api().get(`v1/specimen/start_date/${id}`).json<number>(),
    enabled,
  })
}

export default useSpecimensStartDateForCalendar
