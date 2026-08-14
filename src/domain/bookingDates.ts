import { addDays, format, startOfDay } from 'date-fns'

const isoDate = (date: Date) => format(date, 'yyyy-MM-dd')

export const defaultStayDates = (now = new Date()) => {
  const today = startOfDay(now)
  return {
    minimumArrival: isoDate(today),
    minimumDeparture: isoDate(addDays(today, 1)),
    checkIn: isoDate(addDays(today, 1)),
    checkOut: isoDate(addDays(today, 4)),
  }
}
