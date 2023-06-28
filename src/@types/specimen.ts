import { states } from '../utils/constants'

export interface TSpecimen {
  id: string
  idIssue: string
  idMetaTitle: string
  barCode: string
  numExists: boolean
  numMissing: boolean
  signature: string
  owner: string
  states: typeof states
  stateDescription: string
  pages: string
  note: string
  name: string
  subName: string
  publication: string
  mutation: string
  releaseMark: string
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
