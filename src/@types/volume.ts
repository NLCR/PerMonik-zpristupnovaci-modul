import { mutationsFromBE, ownersFromBE } from '../utils/constants'
import { TMetaTitle } from './metaTitle'
import { TSpecimen, TSpecimensPublicationDays } from './specimen'

export interface TVolumeDetail {
  volume: TVolume
  metaTitle: TMetaTitle
  specimens: {
    specimenList: TSpecimen[]
    specimensDateRange: TSpecimensPublicationDays
  }
}

export interface TVolume {
  id: string
  barCode: string
  dateFrom: string
  dateTo: string
  metaTitleId: string
  mutation: typeof mutationsFromBE
  periodicity: TParsedPeriodicity[]
  pagesCount: number | null
  firstNumber: string
  lastNumber: string
  note: string
  showAttachmentsAtTheEnd: boolean
  signature: string
  owner: typeof ownersFromBE
  year: string | null
  publicationMark: string
}

export interface TParsedPeriodicity {
  isAttachment: boolean
  publication: string
  active: boolean
  day: TPeriodicityDays
  pagesCount: number
  name: string
  subName: string
}

type TPeriodicityDays =
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday'
  | 'Sunday'
