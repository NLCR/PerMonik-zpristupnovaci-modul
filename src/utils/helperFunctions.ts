import dayjs from 'dayjs'
import { BACK_META_TITLE_ID, JUMP_TO_SPECIMEN_WITH_ID } from './constants'

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

export const generateVolumeUrlWithParams = (
  url: string,
  metaTitleId: string,
  specimenId?: string
) => {
  let volumeUrl = `${url}?${BACK_META_TITLE_ID}=${metaTitleId}`

  if (specimenId) {
    volumeUrl += `&${JUMP_TO_SPECIMEN_WITH_ID}=${specimenId}`
  }

  return volumeUrl
}
