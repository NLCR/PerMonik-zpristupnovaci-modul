import { z } from 'zod'
import { v4 as uuid } from 'uuid'
import {
  SpecimenSchema,
  SpecimenFacetSchema,
  SpecimenDamageTypesFacet,
} from './specimen'
import { TPublication } from './publication'

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
  publicationId: z.string().length(36),
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
  id: z.string().length(36),
  barCode: z.string().min(1),
  dateFrom: z.string().min(1),
  dateTo: z.string().min(1),
  metaTitleId: z.string().length(36),
  mutationId: z.string().length(36),
  periodicity: VolumePeriodicitySchema.array(),
  firstNumber: z.number().min(0),
  lastNumber: z.number().min(0),
  note: z.string(),
  showAttachmentsAtTheEnd: z.boolean(),
  signature: z.string(),
  ownerId: z.string().length(36),
  year: z.number().min(0),
  publicationMark: z.string(),
})

export const EditableVolumeSchema = z.object({
  id: z.string(),
  barCode: z.string(),
  dateFrom: z.string(),
  dateTo: z.string(),
  metaTitleId: z.string(),
  mutationId: z.string(),
  periodicity: EditableVolumePeriodicitySchema.array(),
  firstNumber: z.string().or(z.number()).optional(),
  lastNumber: z.string().or(z.number()).optional(),
  note: z.string(),
  showAttachmentsAtTheEnd: z.boolean(),
  signature: z.string(),
  ownerId: z.string(),
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

export const repairVolume = (
  volume: TEditableVolume,
  publications: TPublication[]
): TVolume => {
  return {
    id: volume.id ?? uuid(),
    barCode: volume.barCode.trim() || '',
    dateFrom: volume.dateFrom ?? '',
    dateTo: volume.dateTo ?? '',
    metaTitleId: volume.metaTitleId ?? '',
    mutationId: volume.mutationId ?? '',
    periodicity:
      volume.periodicity.map((p) => ({
        numExists: p.numExists ?? false,
        isAttachment: p.isAttachment ?? false,
        publicationId:
          p.publicationId ??
          publications.find((pub) => pub.isDefault)?.id ??
          '',
        day: p.day,
        pagesCount: Number(p.pagesCount) ?? 0,
        name: p.name.trim() ?? '',
        subName: p.subName.trim() ?? '',
      })) ?? [],
    firstNumber: Number(volume.firstNumber) ?? -1,
    lastNumber: Number(volume.lastNumber),
    note: volume.note.trim() ?? '',
    showAttachmentsAtTheEnd: volume.showAttachmentsAtTheEnd ?? false,
    signature: volume.signature.trim() ?? '',
    ownerId: volume.ownerId ?? '',
    year: Number(volume.year) ?? -1,
    publicationMark: volume.publicationMark.trim() ?? '',
  }
}
