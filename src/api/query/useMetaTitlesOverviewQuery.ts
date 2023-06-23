import { useQuery } from '@tanstack/react-query'
import { api } from '../index'
import { TMetaTitlesOverview } from '../../@types/metaTitle'

const useMetaTitlesOverviewQuery = () =>
  useQuery(['metatitles-overview'], () =>
    api().get('v1/metatitle/overviews').json<TMetaTitlesOverview[]>()
  )

export default useMetaTitlesOverviewQuery
