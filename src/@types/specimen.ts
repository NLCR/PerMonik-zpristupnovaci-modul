import {
  mutationsFromBE,
  ownersFromBE,
  publicationsFromBE,
  states,
} from '../utils/constants'

export interface TSpecimen {
  id: string
  idIssue: string
  idMetaTitle: string
  barCode: string
  numExists: boolean
  numMissing: boolean
  signature: string
  owner: typeof ownersFromBE
  states: typeof states | null
  state: 'ok' | 'auto'
  stateDescription: string
  pages: { damaged: string[]; missing: string[] }
  note: string
  name: string
  subName: string
  publication: typeof publicationsFromBE
  mutation: typeof mutationsFromBE
  publicationMark: string
  publicationDate: string
  publicationDay: string
  periodicity: string
  number: string
  metaTitleName: string
  pagesCount: number
  isAttachment: boolean
}

export interface TSpecimensPublicationDays {
  publicationDayMin: string | null
  publicationDayMax: string | null
}

interface TSpecimenFacet {
  name: string
  count: number
}

export interface TSpecimensFacets {
  names: TSpecimenFacet[]
  mutations: TSpecimenFacet[]
  publications: TSpecimenFacet[]
  publicationMarks: TSpecimenFacet[]
  owners: TSpecimenFacet[]
  states: TSpecimenFacet[]
}
