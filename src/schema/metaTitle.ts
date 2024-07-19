import { z } from 'zod'
import i18next from '../i18next'

export const MetaTitleSchema = z.object({
  id: z.string(),
  name: z.string().min(1, i18next.t('schema.name_min_length')),
  note: z.string(),
  isPublic: z.boolean(),
})

export const EditableMetaTitleSchema = MetaTitleSchema.partial({ id: true })

export type TMetaTitle = z.infer<typeof MetaTitleSchema>
export type TEditableMetaTitle = z.infer<typeof EditableMetaTitleSchema>