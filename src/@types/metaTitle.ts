import { TSpecimensPublicationDays } from './specimen'

export interface TMetaTitlesWithStats {
  id: string
  name: string
  specimens: {
    mutationsCount: number
    ownersCount: number
    groupedSpecimens: number
    matchedSpecimens: number
  } & TSpecimensPublicationDays
}

export interface TMetaTitle {
  id: string
  name: string
  periodicity: string
  note: string | null
  showToNotLoggedUsers: boolean
}
