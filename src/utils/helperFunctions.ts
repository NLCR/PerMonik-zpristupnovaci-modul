import dayjs from 'dayjs'

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
