import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import type { TVolume } from './volume'
import { AuditableSchema, copyAuditable } from './common'
import { TEdition } from './edition'

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SpecimensPublicationDaysSchema = z.object({
  publicationDayMin: z.string().nullable(),
  publicationDayMax: z.string().nullable(),
})

export const SpecimenDamageTypesFacet = z.object({
  name: SpecimenDamageTypesSchema,
  count: z.number(),
})

export const SpecimenSchema = AuditableSchema.extend({
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
  editionId: z.string().length(36),
  mutationId: z.string().length(36),
  mutationMark: z.string(),
  publicationDate: z.string().min(1),
  publicationDateString: z.string().min(1),
  number: z.string().nullable(),
  attachmentNumber: z.string().nullable(),
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
// editionId: true,
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

export const filterSpecimen = (
  specimen: TEditableSpecimen
): TEditableSpecimen => {
  return {
    ...copyAuditable(specimen),
    id: specimen.id,
    metaTitleId: specimen.metaTitleId,
    volumeId: specimen.volumeId,
    barCode: specimen.barCode.trim(),
    numExists: specimen.numExists,
    numMissing: specimen.numMissing,
    ownerId: specimen.ownerId,
    damageTypes: specimen.damageTypes,
    damagedPages: specimen.damagedPages,
    missingPages: specimen.missingPages,
    note: specimen.note.trim(),
    name: specimen.name.trim(),
    subName: specimen.subName.trim(),
    editionId: specimen.editionId,
    mutationId: specimen.mutationId,
    mutationMark: specimen.mutationMark.trim(),
    publicationDate: specimen.publicationDate,
    publicationDateString: specimen.publicationDateString,
    number: specimen.number ? specimen.number.trim() : null,
    attachmentNumber: specimen.attachmentNumber
      ? specimen.attachmentNumber.trim()
      : null,
    pagesCount: Number(
      specimen.pagesCount.toString().replace(/\D/g, '').trim()
    ),
    isAttachment: specimen.isAttachment,
    duplicated: specimen.duplicated,
  }
}

export const repairOrCreateSpecimen = (
  specimen: Partial<TEditableSpecimen>,
  volume: TVolume
): TSpecimen => {
  return {
    ...copyAuditable(specimen),
    id: specimen.id ?? uuid(),
    metaTitleId: volume.metaTitleId,
    volumeId: volume.id,
    barCode: volume.barCode.trim(),
    numExists: specimen.numExists ?? false,
    numMissing: specimen.numMissing ?? false,
    ownerId: volume.ownerId,
    damageTypes: specimen.damageTypes ?? [],
    damagedPages: specimen.damagedPages ?? [],
    missingPages: specimen.missingPages ?? [],
    note: specimen.note?.trim() ?? '',
    name: specimen.name?.trim() ?? '',
    subName: specimen.subName?.trim() ?? '',
    editionId: specimen.editionId ?? '',
    mutationId: specimen.mutationId ?? '',
    mutationMark: specimen.mutationMark?.trim() ?? '',
    publicationDate: specimen.publicationDate ?? '',
    publicationDateString: specimen.publicationDateString ?? '',
    number: specimen.number?.trim() ?? '',
    attachmentNumber: specimen.attachmentNumber?.trim() ?? '',
    pagesCount: specimen.pagesCount ?? 0,
    isAttachment: specimen.isAttachment ?? false,
  }
}

export const copySpecimen = (
  specimen: Partial<TEditableSpecimen>
): TEditableSpecimen => {
  return {
    ...copyAuditable(specimen),
    id: uuid(),
    metaTitleId: specimen.metaTitleId ?? '',
    volumeId: specimen.volumeId ?? '',
    barCode: specimen.barCode ?? '',
    numExists: specimen.numExists ?? false,
    numMissing: specimen.numMissing ?? false,
    ownerId: specimen.ownerId ?? '',
    damageTypes: specimen.damageTypes ?? [],
    damagedPages: specimen.damagedPages ?? [],
    missingPages: specimen.missingPages ?? [],
    note: specimen.note ?? '',
    name: specimen.name ?? '',
    subName: specimen.subName ?? '',
    editionId: specimen.editionId ?? '',
    mutationId: specimen.mutationId ?? '',
    mutationMark: specimen.mutationMark ?? '',
    publicationDate: specimen.publicationDate ?? '',
    publicationDateString: specimen.publicationDateString ?? '',
    number: specimen.number ?? '',
    attachmentNumber: specimen.attachmentNumber ?? '',
    pagesCount: specimen.pagesCount ?? 0,
    isAttachment: specimen.isAttachment ?? false,
    duplicated: true,
  }
}

export const duplicateSpecimen = (
  specimen: TSpecimen,
  volume: TVolume
): TEditableSpecimen => {
  return {
    id: uuid(),
    metaTitleId: specimen.metaTitleId,
    volumeId: volume.id,
    barCode: '',
    numExists: specimen.numExists,
    numMissing: specimen.numMissing,
    ownerId: volume.ownerId,
    damageTypes: [],
    damagedPages: [],
    missingPages: [],
    note: '',
    name: specimen.name,
    subName: specimen.subName,
    editionId: specimen.editionId,
    mutationId: specimen.mutationId,
    mutationMark: specimen.mutationMark,
    publicationDate: specimen.publicationDate,
    publicationDateString: specimen.publicationDateString,
    number: specimen.number,
    attachmentNumber: specimen.attachmentNumber,
    pagesCount: specimen.pagesCount,
    isAttachment: specimen.isAttachment,
    duplicated: true,
  }
}

export const checkAttachmentChange = (
  editions: TEdition[],
  specimen: TEditableSpecimen
): TEditableSpecimen => {
  const edition = editions.find((p) => p.id === specimen.editionId)
  const isAttachment =
    edition?.isAttachment || edition?.isPeriodicAttachment || false

  return {
    ...specimen,
    isAttachment: isAttachment,
  }
}
