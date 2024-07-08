import { TSpecimensPublicationDays } from './specimen'

export interface TMetaTitleOverview {
  id: string
  name: string
  specimens: {
    mutationsCount: number
    ownersCount: number
    // groupedSpecimens: number
    matchedSpecimens: number
  } & TSpecimensPublicationDays
}
