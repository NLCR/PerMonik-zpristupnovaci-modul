import { z } from 'zod'
import i18next from '../i18next'

export const PublicationSchema = z.object({
  id: z.string(),
  name: z.object({
    cs: z.string().min(1, i18next.t('schema.cs_name_min_length')),
    sk: z.string().min(1, i18next.t('schema.sk_name_min_length')),
    en: z.string().min(1, i18next.t('schema.en_name_min_length')),
  }),
  isDefault: z.boolean(),
})

export const EditablePublicationSchema = PublicationSchema.partial({ id: true })

export type TPublication = z.infer<typeof PublicationSchema>
export type TEditablePublication = z.infer<typeof EditablePublicationSchema>
