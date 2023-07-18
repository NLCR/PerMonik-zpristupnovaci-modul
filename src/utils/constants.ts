export const GRANT_TOKEN = 'grant'
export const AUTH_TOKEN = 'auth_token'
export const REFRESH_TOKEN = 'refresh_token'
export const REMEMBER_ME = 'remember_me'

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
  'ChDatum',
] as const

export const publicationsFromBE = [
  '0',
  '1',
  '2',
  '3',
  '4',
  '5',
  '7',
  '6',
] as const

export const mutationsFromBE = ['0', '1', '2', '3'] as const

export const ownersFromBE = ['0', '1', '2', '3'] as const

export const owners = [
  { id: 0, name: 'NKP', sigla: 'ABA001' },
  { id: 1, name: 'MZK', sigla: 'BOA001' },
  { id: 2, name: 'VKOL', sigla: 'OLA001' },
  { id: 3, name: 'KUK', sigla: 'ULG001' },
] as const
