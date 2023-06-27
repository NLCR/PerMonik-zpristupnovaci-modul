import i18next from '../i18next'

/**
 Function accepts string in format 19901010
 * */
export const formatDate = (date: string) => {
  const year = Number(date.substring(0, 4))
  const month = Number(date.substring(4, 2)) - 1 // Months are 0-indexed in JavaScript, so subtract 1
  const day = Number(date.substring(6, 2))

  return new Date(year, month, day).toLocaleDateString(
    i18next.resolvedLanguage,
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }
  )
}

/**
Function accepts string in format 1990-10-10
 * */
export const formatDateWithDashes = (date: string) => {
  const parts = date.split('-')

  return new Date(
    Number(parts[0]),
    Number(parts[1]),
    Number(parts[2])
  ).toLocaleDateString(i18next.resolvedLanguage, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
