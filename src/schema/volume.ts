import { z } from 'zod'
// eslint-disable-next-line import/no-cycle
import {
  SpecimenSchema,
  SpecimenFacetSchema,
  SpecimenDamageTypesFacet,
} from './specimen'

export const VolumePeriodicityDaysSchema = z.enum([
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
])

export const VolumePeriodicitySchema = z.object({
  numExists: z.boolean(),
  isAttachment: z.boolean(),
  publicationId: z.string(),
  day: VolumePeriodicityDaysSchema,
  pagesCount: z.number(),
  name: z.string(),
  subName: z.string(),
})

export const EditableVolumePeriodicitySchema = z.object({
  numExists: z.boolean(),
  isAttachment: z.boolean(),
  publicationId: z.string().nullable(),
  day: VolumePeriodicityDaysSchema,
  pagesCount: z.number().or(z.string()),
  name: z.string(),
  subName: z.string(),
})

export const VolumeSchema = z.object({
  id: z.string(),
  barCode: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  metaTitleId: z.string(),
  mutationId: z.string(),
  periodicity: VolumePeriodicitySchema.array(),
  firstNumber: z.number(),
  lastNumber: z.number(),
  note: z.string(),
  showAttachmentsAtTheEnd: z.boolean(),
  signature: z.string(),
  ownerId: z.string(),
  year: z.number(),
  publicationMark: z.string(),
})

export const EditableVolumeSchema = z.object({
  id: z.string().nullable(),
  barCode: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  metaTitleId: z.string().nullable(),
  mutationId: z.string().nullable(),
  periodicity: EditableVolumePeriodicitySchema.array(),
  firstNumber: z.string().or(z.number()).optional(),
  lastNumber: z.string().or(z.number()).optional(),
  note: z.string(),
  showAttachmentsAtTheEnd: z.boolean(),
  signature: z.string(),
  ownerId: z.string().nullable(),
  year: z.string().or(z.number()).optional(),
  publicationMark: z.string(),
})

// export const EditableVolumeSchema = VolumeSchema.extend({
//   firstNumber: z.string().or(z.number()),
//   lastNumber: z.string().or(z.number()),
//   year: z.string().or(z.number()),
// }).partial({ id: true, metaTitleId: true, mutationId: true, ownerId: true })

// for final check before sending request to BE
export const CreatableVolumeSchema = VolumeSchema.partial({ id: true })

const VolumeDetailSchema = z.object({
  volume: VolumeSchema,
  specimens: SpecimenSchema.array(),
})

const VolumeOverviewStatsSchema = z.object({
  metaTitleName: z.string(),
  ownerId: z.string(),
  signature: z.string(),
  barCode: z.string(),
  publicationDayMin: z.string().nullable(),
  publicationDayMax: z.string().nullable(),
  numberMin: z.string().nullable(),
  numberMax: z.string().nullable(),
  pagesCount: z.string().nullable(),
  mutationIds: SpecimenFacetSchema.array(),
  publicationMark: SpecimenFacetSchema.array(),
  publicationIds: SpecimenFacetSchema.array(),
  damageTypes: SpecimenDamageTypesFacet.array(),
  publicationDayRanges: SpecimenFacetSchema.array(),
  specimens: SpecimenSchema.array(),
})

export type TVolumePeriodicityDays = z.infer<typeof VolumePeriodicityDaysSchema>
export type TVolumePeriodicity = z.infer<typeof VolumePeriodicitySchema>
export type TEditableVolumePeriodicity = z.infer<
  typeof EditableVolumePeriodicitySchema
>
export type TVolume = z.infer<typeof VolumeSchema>
export type TEditableVolume = z.infer<typeof EditableVolumeSchema>
export type TCreatableVolume = z.infer<typeof CreatableVolumeSchema>
export type TVolumeDetail = z.infer<typeof VolumeDetailSchema>
export type TVolumeOverviewStats = z.infer<typeof VolumeOverviewStatsSchema>

// export const repairVolume = (volume: TEditableVolume): TVolume => {
//   return {
//     id: volume.id ?? uuid(),
//     barCode: volume.id || '',
//     dateFrom: volume.dateFrom ?? '',
//     dateTo: volume.dateTo ?? '',
//     metaTitleId: volume.metaTitleId ?? '',
//     mutationId: volume.mutationId ?? '',
//     periodicity: volume.periodicity ?? [],
//     firstNumber: volume.firstNumber ?? '',
//     lastNumber: z.number(),
//     note: z.string(),
//     showAttachmentsAtTheEnd: z.boolean(),
//     signature: z.string(),
//     ownerId: z.string(),
//     year: z.number(),
//     publicationMark: z.string(),
//   }
// }
