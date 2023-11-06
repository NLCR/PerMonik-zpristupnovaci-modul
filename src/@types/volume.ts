import { mutationsFromBE, ownersFromBE } from '../utils/constants'
import { TMetaTitle } from './metaTitle'
import {
  TSpecimen,
  TSpecimenFacet,
  TSpecimensPublicationDays,
  TSpecimenStatesFacet,
} from './specimen'

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

export interface TVolumeOverviewStats {
  metaTitleName: string
  owner: typeof ownersFromBE
  signature: string
  barCode: string
  publicationDayMin: string | null
  publicationDayMax: string | null
  numberMin: string | null
  numberMax: string | null
  pagesCount: string | null
  mutations: TSpecimenFacet[]
  publicationMark: TSpecimenFacet[]
  publication: TSpecimenFacet[]
  states: TSpecimenStatesFacet[]
  publicationDayRanges: TSpecimenFacet[]
  specimens: TSpecimen[]
}
