import { useMemo } from 'react'
import dayjs from 'dayjs'
import { Month } from '../../../shared/types';

export function useMonthGenerator(monthsCount: number = 12): Month[] {
  const months = useMemo((): Month[] => {
    const monthsList: Month[] = []
    const today = dayjs()

    for (let i = 0; i < monthsCount; i++) {
      const month = today.add(i, 'month')
      monthsList.push({
        value: month.format('M'),
        label: month.format('MMMM YYYY')
      })
    }
    return monthsList
  }, [monthsCount])

  return months
}