import dayjs from 'dayjs'
import i18next from '../i18next'

/**
 Function accepts string in format 19901010
 * */
export const formatDateToString = (date: string) => {
  const year = Number(date.substring(0, 4))
  const month = Number(date.substring(4, 6)) - 1 // Months are 0-indexed in JavaScript, so subtract 1
  const day = Number(date.substring(6, 8))

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
 Function accepts string in format 19901010
 * */
export const createDate = (date: string) => {
  const year = Number(date.substring(0, 4))
  const month = Number(date.substring(4, 6)) - 1 // Months are 0-indexed in JavaScript, so subtract 1
  const day = Number(date.substring(6, 8))
  return new Date(year, month, day)
}

/**
Function accepts string in format 1990-10-10
 * */
export const formatDateWithDashesToString = (date: string) => {
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

/**
 Function accepts Date object
 * */
export const formatDareObjectToStringOfNumbers = (date: Date) => {
  const newDate = dayjs(date)
  return `${newDate.format('YYYYMMDD')}`
}
