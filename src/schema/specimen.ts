import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import type { TVolume } from './volume'

export const SpecimenDamageTypesSchema = z.enum([
  'OK',
  'ChCC',
  'ChS',
  'PP',
  'Deg',
  'ChPag',
  'ChCis',
  'ChSv',
  'Cz',
  'NS',
  'CzV',
  'ChDatum',
])

const SpecimensPublicationDaysSchema = z.object({
  publicationDayMin: z.string().nullable(),
  publicationDayMax: z.string().nullable(),
})

export const SpecimenDamageTypesFacet = z.object({
  name: SpecimenDamageTypesSchema,
  count: z.number(),
})

export const SpecimenSchema = z.object({
  id: z.string().length(36),
  metaTitleId: z.string().length(36),
  volumeId: z.string().length(36),
  barCode: z.string().min(1),
  numExists: z.boolean(),
  numMissing: z.boolean(),
  ownerId: z.string().length(36),
  damageTypes: SpecimenDamageTypesSchema.array().nullable(),
  damagedPages: z.number().array().nullable(),
  missingPages: z.number().array().nullable(),
  note: z.string(),
  name: z.string(),
  subName: z.string(),
  publicationId: z.string().length(36),
  mutationId: z.string().length(36),
  publicationMark: z.string(),
  publicationDate: z.string().min(1),
  publicationDateString: z.string().min(1),
  number: z.string(),
  pagesCount: z.number(),
  isAttachment: z.boolean(),
})

export const EditableSpecimenSchema = SpecimenSchema.extend({
  duplicated: z.boolean().optional(),
})
// export const EditableSpecimenSchema = SpecimenSchema.partial({
//   id: true,
// metaTitleId: true,
// volumeId: true,
// barCode: true,
// ownerId: true,
// publicationId: true,
// mutationId: true,
// })

export const SpecimenFacetSchema = z.object({
  name: z.string(),
  count: z.number(),
})

export type TSpecimenDamageTypes = z.infer<typeof SpecimenDamageTypesSchema>
export type TSpecimen = z.infer<typeof SpecimenSchema>
export type TEditableSpecimen = z.infer<typeof EditableSpecimenSchema>
export type TSpecimenFacet = z.infer<typeof SpecimenFacetSchema>
export type TSpecimenDamageTypesFacet = z.infer<typeof SpecimenDamageTypesFacet>
export type TSpecimensPublicationDays = z.infer<
  typeof SpecimensPublicationDaysSchema
>

export const filterSpecimen = (input: TEditableSpecimen): TEditableSpecimen => {
  return {
    id: input.id,
    metaTitleId: input.metaTitleId,
    volumeId: input.volumeId,
    barCode: input.barCode,
    numExists: input.numExists,
    numMissing: input.numMissing,
    ownerId: input.ownerId,
    damageTypes: input.damageTypes,
    damagedPages: input.damagedPages,
    missingPages: input.missingPages,
    note: input.note,
    name: input.name,
    subName: input.subName,
    publicationId: input.publicationId,
    mutationId: input.mutationId,
    publicationMark: input.publicationMark,
    publicationDate: input.publicationDate,
    publicationDateString: input.publicationDateString,
    number: input.number,
    pagesCount: input.pagesCount,
    isAttachment: input.isAttachment,
    duplicated: input.duplicated,
  }
}

export const repairOrCreateSpecimen = (
  specimen: Partial<TEditableSpecimen>,
  volume: TVolume
): TSpecimen => {
  return {
    id: specimen.id ?? uuid(),
    metaTitleId: volume.metaTitleId,
    volumeId: volume.id,
    barCode: volume.barCode,
    numExists: specimen.numExists ?? false,
    numMissing: specimen.numMissing ?? false,
    ownerId: volume.ownerId,
    damageTypes: specimen.damageTypes ?? [],
    damagedPages: specimen.damagedPages ?? [],
    missingPages: specimen.missingPages ?? [],
    note: specimen.note ?? '',
    name: specimen.name ?? '',
    subName: specimen.subName ?? '',
    publicationId: specimen.publicationId ?? '',
    mutationId: specimen.mutationId ?? '',
    publicationMark: specimen.publicationMark ?? '',
    publicationDate: specimen.publicationDate ?? '',
    publicationDateString: specimen.publicationDateString ?? '',
    number: specimen.number ?? '',
    pagesCount: specimen.pagesCount ?? 0,
    isAttachment: specimen.isAttachment ?? false,
  }
}

export const duplicateSpecimen = (
  input: Partial<TEditableSpecimen>
): TEditableSpecimen => {
  return {
    id: uuid(),
    metaTitleId: input.metaTitleId ?? '',
    volumeId: input.volumeId ?? '',
    barCode: input.barCode ?? '',
    numExists: input.numExists ?? false,
    numMissing: input.numMissing ?? false,
    ownerId: input.ownerId ?? '',
    damageTypes: input.damageTypes ?? [],
    damagedPages: input.damagedPages ?? [],
    missingPages: input.missingPages ?? [],
    note: input.note ?? '',
    name: input.name ?? '',
    subName: input.subName ?? '',
    publicationId: input.publicationId ?? '',
    mutationId: input.mutationId ?? '',
    publicationMark: input.publicationMark ?? '',
    publicationDate: input.publicationDate ?? '',
    publicationDateString: input.publicationDateString ?? '',
    number: input.number ?? '',
    pagesCount: input.pagesCount ?? 0,
    isAttachment: input.isAttachment ?? false,
    duplicated: true,
  }
}
