import i18next from '../i18next'

// eslint-disable-next-line import/prefer-default-export
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
