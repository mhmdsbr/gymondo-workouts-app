import { useState, useMemo } from 'react'
import dayjs from 'dayjs'
import type { Workout } from '../types'

export function useWorkoutFilters(workouts: Workout[]) {
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  // Get all unique categories from workouts
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    workouts.forEach(workout => categories.add(workout.category))
    return Array.from(categories).sort()
  }, [workouts])

  // Filter workouts based on selected filters
  const filteredWorkouts = useMemo(() => {
    return workouts.filter(workout => {
      // Filter by month if selected
      const monthMatch = !selectedMonth || dayjs(workout.startDate).format('YYYY-MM') === selectedMonth

      // Filter by categories if any selected
      const categoryMatch = selectedCategories.length === 0 || selectedCategories.includes(workout.category)

      return monthMatch && categoryMatch
    })
  }, [workouts, selectedMonth, selectedCategories])

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const resetFilters = () => {
    setSelectedMonth('')
    setSelectedCategories([])
  }

  return {
    selectedMonth,
    setSelectedMonth,
    selectedCategories,
    setSelectedCategories,
    allCategories,
    filteredWorkouts,
    handleCategoryChange,
    resetFilters,
  }
}