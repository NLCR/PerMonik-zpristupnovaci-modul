import { z } from 'zod'

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

export const SpecimenDamageTypesFacet = z.object({
  name: SpecimenDamageTypesSchema,
  count: z.number(),
})

export const SpecimenSchema = z.object({
  id: z.string(),
  metaTitleId: z.string(),
  volumeId: z.string(),
  barCode: z.string(),
  numExists: z.boolean(),
  numMissing: z.boolean(),
  ownerId: z.string(),
  damageTypes: SpecimenDamageTypesSchema.array(),
  damagedPages: z.number().array(),
  missingPages: z.number().array(),
  note: z.string(),
  name: z.string(),
  subName: z.string(),
  publicationId: z.string(),
  mutationId: z.string(),
  publicationMark: z.string(),
  publicationDate: z.string(),
  publicationDateString: z.string(),
  number: z.string(),
  pagesCount: z.number(),
  isAttachment: z.boolean(),
})

export const EditableSpecimenSchema = SpecimenSchema
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

export type TSpecimen = z.infer<typeof SpecimenSchema>
export type TEditableSpecimen = z.infer<typeof EditableSpecimenSchema>
export type TSpecimenFacet = z.infer<typeof SpecimenFacetSchema>
