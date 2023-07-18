import { useTranslation } from 'react-i18next'
import { MRT_Localization_CS } from 'mantine-react-table/locales/cs'
import { MRT_Localization_SK } from 'mantine-react-table/locales/sk'
import { MRT_Localization_EN } from 'mantine-react-table/locales/en'

export const useTranslatedConstants = () => {
  const { t } = useTranslation()

  const publications = [
    { id: 0, name: t('publications.0') },
    { id: 1, name: t('publications.1') },
    { id: 2, name: t('publications.2') },
    { id: 3, name: t('publications.3') },
    { id: 4, name: t('publications.4') },
    { id: 5, name: t('publications.5') },
    { id: 7, name: t('publications.7') },
    { id: 6, name: t('publications.6') },
  ]

  const mutations = [
    { id: 0, name: t('facet_states.empty') },
    { id: 1, name: 'Brno' },
    { id: 2, name: 'Praha' },
    { id: 3, name: 'Ostrava' },
  ]

  return { publications, mutations }
}

export const useMantineTableLang = () => {
  const { i18n } = useTranslation()

  const getLocale = () => {
    switch (i18n.resolvedLanguage) {
      case 'cs':
        return MRT_Localization_CS
      case 'sk':
        return MRT_Localization_SK
      case 'en':
        return MRT_Localization_EN
      default:
        return MRT_Localization_CS
    }
  }

  return { mantineTableLocale: getLocale() }
}
