import { TMetaTitle } from './metaTitle'
import {
  TSpecimen,
  TSpecimenFacet,
  TSpecimensPublicationDays,
  TSpecimenDamageTypesFacet,
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
  mutationId: string
  periodicity: TParsedPeriodicity[]
  firstNumber: number
  lastNumber: string
  note: string
  showAttachmentsAtTheEnd: boolean
  signature: string
  ownerId: string
  year: number
  publicationMark: string
}

export interface TParsedPeriodicity {
  active: boolean
  publication: string
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
  ownerId: string
  signature: string
  barCode: string
  publicationDayMin: string | null
  publicationDayMax: string | null
  numberMin: string | null
  numberMax: string | null
  pagesCount: string | null
  mutationIds: TSpecimenFacet[]
  publicationMark: TSpecimenFacet[]
  publicationIds: TSpecimenFacet[]
  damageTypes: TSpecimenDamageTypesFacet[]
  publicationDayRanges: TSpecimenFacet[]
  specimens: TSpecimen[]
}
