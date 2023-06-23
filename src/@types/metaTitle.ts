export interface TMetaTitlesOverview {
  id: string
  name: string
  specimens: {
    publicationDayMin: string | null
    publicationDayMax: string | null
    mutationsCount: number
    ownersCount: number
    groupedSpecimens: number
    matchedSpecimens: number
  }
}
