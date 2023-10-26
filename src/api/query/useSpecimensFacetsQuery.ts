import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { useDebouncedValue } from '@mantine/hooks'
import { api } from '../index'
import { TSpecimensFacets } from '../../@types/specimen'
import { useSpecimensOverviewStore } from '../../slices/useSpecimensOverviewStore'

export interface TSpecimensWithFacets extends TSpecimensFacets {}

const useSpecimensFacetsQuery = (idTitle: string, enabled: boolean) => {
  const { params, volumeInput } = useSpecimensOverviewStore()
  const [debouncedVolumeInput] = useDebouncedValue(volumeInput, 400)

  return useQuery({
    queryKey: ['specimens-facets', idTitle, params, debouncedVolumeInput],
    queryFn: () => {
      const formData = new FormData()
      formData.set(
        'facets',
        JSON.stringify({
          ...params,
          volume: debouncedVolumeInput.trim().replaceAll(' ', ''),
        })
      )

      return api()
        .post(`v1/specimen/facets/${idTitle}`, {
          body: formData,
        })
        .json<TSpecimensWithFacets>()
    },
    placeholderData: keepPreviousData,
    enabled,
  })
}

export default useSpecimensFacetsQuery
