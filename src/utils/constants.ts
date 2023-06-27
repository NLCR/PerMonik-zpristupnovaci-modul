import i18next from '../i18next'

export const GRANT_TOKEN = 'grant'
export const AUTH_TOKEN = 'auth_token'
export const REFRESH_TOKEN = 'refresh_token'
export const REMEMBER_ME = 'remember_me'

export const owners = [
  { id: 0, name: 'NKP', sigla: 'ABA001' },
  { id: 1, name: 'MZK', sigla: 'BOA001' },
  { id: 2, name: 'VKOL', sigla: 'OLA001' },
  { id: 3, name: 'KUK', sigla: 'ULG001' },
] as const

export const states = [
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
] as const

export const publications = [
  { id: 0, name: i18next.t('publications.0') },
  { id: 1, name: i18next.t('publications.1') },
  { id: 2, name: i18next.t('publications.2') },
  { id: 3, name: i18next.t('publications.3') },
  { id: 4, name: i18next.t('publications.4') },
  { id: 5, name: i18next.t('publications.5') },
  { id: 7, name: i18next.t('publications.7') },
  { id: 6, name: i18next.t('publications.6') },
] as const

export const mutations = [
  { id: 0, name: '' },
  { id: 1, name: 'Brno' },
  { id: 2, name: 'Praha' },
  { id: 3, name: 'Ostrava' },
] as const
