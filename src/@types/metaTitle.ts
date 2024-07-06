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

export interface TMetaTitle {
  id: string
  name: string
  note: string | null
  isPublic: boolean
}
