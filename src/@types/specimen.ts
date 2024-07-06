import { damageTypes } from '../utils/constants'

export interface TSpecimen {
  id: string
  metaTitleId: string
  volumeId: string
  barCode: string
  numExists: boolean
  numMissing: boolean
  ownerId: string
  damageTypes: typeof damageTypes
  damagedPages: number[]
  missingPages: number[]
  note: string
  name: string
  subName: string
  publicationId: string
  mutationId: string
  publicationMark: string
  publicationDate: string
  publicationDateString: string
  number: string
  pagesCount: number
  isAttachment: boolean
}

export interface TSpecimensPublicationDays {
  publicationDayMin: string | null
  publicationDayMax: string | null
}

export interface TSpecimenFacet {
  name: string
  count: number
}

export interface TSpecimenDamageTypesFacet {
  name: (typeof damageTypes)[number]
  count: number
}

export interface TSpecimensFacets {
  names: TSpecimenFacet[]
  subNames: TSpecimenFacet[]
  mutationIds: TSpecimenFacet[]
  publicationIds: TSpecimenFacet[]
  publicationMarks: TSpecimenFacet[]
  ownerIds: TSpecimenFacet[]
  damageTypes: TSpecimenDamageTypesFacet[]
}
