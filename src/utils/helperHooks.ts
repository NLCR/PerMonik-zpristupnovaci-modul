import { useTranslation } from 'react-i18next'
import { csCZ, skSK, enUS } from '@mui/x-data-grid-pro/locales'
import { TSupportedLanguages } from '../i18next'

export const useLanguageCode = () => {
  const { i18n } = useTranslation()
  return { languageCode: i18n.resolvedLanguage as TSupportedLanguages }
}

export const useMuiTableLang = () => {
  const { i18n } = useTranslation()

  const getLocale = () => {
    switch (i18n.resolvedLanguage) {
      case 'cs':
        return csCZ.components.MuiDataGrid.defaultProps.localeText
      case 'sk':
        return skSK.components.MuiDataGrid.defaultProps.localeText
      case 'en':
        return enUS.components.MuiDataGrid.defaultProps.localeText
      default:
        return csCZ.components.MuiDataGrid.defaultProps.localeText
    }
  }

  return { MuiTableLocale: getLocale() }
}
