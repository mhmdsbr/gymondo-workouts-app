import { useMemo } from 'react'
import dayjs from 'dayjs'
import { Month } from '../../../shared/types';

/**
 * Custom hook for generating a list of months starting from the current month
 *
 * @param monthsCount - Number of consecutive months to generate (default: 12)
 * @returns Array of Month objects with value (month number) and label (formatted month/year)
 *
 */
export function useMonthGenerator(monthsCount: number = 12): Month[] {

  /**
   * Memoized months array generation
   *
   * Uses useMemo to prevent unnecessary recalculations when the component
   * re-renders, only recalculating when monthsCount changes.
   *
   */
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