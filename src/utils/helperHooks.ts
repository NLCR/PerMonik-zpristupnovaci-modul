import { useTranslation } from 'react-i18next'
import { MRT_Localization_CS } from 'mantine-react-table/locales/cs'
import { MRT_Localization_SK } from 'mantine-react-table/locales/sk'
import { MRT_Localization_EN } from 'mantine-react-table/locales/en'
import { TSupportedLanguages } from '../i18next'

export const useLanguageCode = () => {
  const { i18n } = useTranslation()
  return { languageCode: i18n.resolvedLanguage as TSupportedLanguages }
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
