import { useMemo } from 'react'
import dayjs from 'dayjs'

export function useMonthGenerator(monthsCount: number = 12) {
  const months = useMemo(() => {
    const monthsList = []
    const today = dayjs()
    for (let i = 0; i < monthsCount; i++) {
      const month = today.add(i, 'month')
      monthsList.push({
        value: month.format('YYYY-MM'),
        label: month.format('MMMM YYYY')
      })
    }
    return monthsList
  }, [monthsCount])

  return months
}