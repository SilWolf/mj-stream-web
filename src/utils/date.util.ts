import dayjs, { Dayjs } from 'dayjs'

export const getArrayOfComingNDates = (n: number = 1): string[] =>
  new Array(n).fill(undefined).map((_, i) =>
    dayjs()
      .add(i + 1, 'day')
      .format('YYYY-MM-DD')
  )

export function renderDateAsShortForm(str: dayjs.ConfigType) {
  return dayjs(str).format('DD/MM')
}

const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
export function renderDayOfDate(str: dayjs.ConfigType) {
  return days[dayjs(str).day() ?? 0]
}
