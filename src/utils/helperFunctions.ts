import dayjs from 'dayjs'
import { z } from 'zod'

// eslint-disable-next-line import/prefer-default-export
export const getFirstMondayOfMonth = (date: Date | null) => {
  if (!date) return null
  const year = date.getFullYear()
  const month = date.getMonth()

  // Find the first Monday in the month
  let firstMonday = dayjs().year(year).month(month).date(1)
  while (firstMonday.day() !== 1) {
    firstMonday = firstMonday.add(1, 'day')
  }

  return firstMonday
}

export function getDefaultsFromZodSchema<Schema extends z.AnyZodObject>(
  schema: Schema
) {
  return Object.fromEntries(
    Object.entries(schema.shape).map(([key, value]) => {
      // eslint-disable-next-line no-underscore-dangle
      if (value instanceof z.ZodDefault) return [key, value._def.defaultValue()]
      return [key, undefined]
    })
  )
}
