import { z } from 'zod'
import { AuditableSchema } from './common'

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
