import i18next from 'i18next'
import { initReactI18next } from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
import cs from './lang/cs/cs'

export const supportedLanguages = ['cs'] as const
export type TSupportedLanguages = (typeof supportedLanguages)[number]
export const defaultLang = 'cs'

export const defaultNS = 'global'
export const resources = {
  cs,
} as const

export const changeLanguage = (lang: TSupportedLanguages) => {
  i18next.changeLanguage(lang).then(() => {
    // eslint-disable-next-line no-console
    console.log(`Language changed to: ${lang}`)
  })
}

i18next.use(LanguageDetector).use(initReactI18next)

if (!i18next.isInitialized) {
  i18next.init({
    ns: [defaultNS],
    fallbackLng: defaultLang,
    supportedLngs: supportedLanguages,
    // lng: userLanguage,
    load: 'languageOnly',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
    defaultNS,
    resources,
    debug: false,
  })
}

export default i18next
