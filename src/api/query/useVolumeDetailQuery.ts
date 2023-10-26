import { useQuery } from '@tanstack/react-query'
import { api } from '../index'
import { TVolumeDetail } from '../../@types/volume'

const useVolumeDetailQuery = (id: string) =>
  useQuery({
    queryKey: ['volume-detail', id],
    queryFn: () =>
      api().get(`v1/volume/detail/${id}`).json<TVolumeDetail | null>(),
  })

export default useVolumeDetailQuery
