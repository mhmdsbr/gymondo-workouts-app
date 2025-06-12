'use client'

import { useState, useEffect, useMemo } from 'react'
import WorkoutCard from './WorkOutCard'
import Pagination from './Pagination'
import LoadingSkeleton from './LoadingSkeleton'
import ErrorMessage from './ErrorMessage'
import dayjs from 'dayjs'

type Workout = {
  id: number
  name: string
  description: string
  startDate: string
  duration: number
  difficulty: string
  category: string
  exercises: string[]
  equipment: string[]
  calories: number
}

export default function WorkoutsList() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  const workoutsPerPage = 10

  // Generate months for filter
  const months = useMemo(() => {
    const monthsList = []
    const today = dayjs()
    for (let i = 0; i < 12; i++) {
      const month = today.add(i, 'month')
      monthsList.push({
        value: month.format('YYYY-MM'),
        label: month.format('MMMM YYYY')
      })
    }
    return monthsList
  }, [])

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
      const monthMatch = !selectedMonth ||
        dayjs(workout.startDate).format('YYYY-MM') === selectedMonth

      // Filter by categories if any selected
      const categoryMatch = selectedCategories.length === 0 ||
        selectedCategories.includes(workout.category)

      return monthMatch && categoryMatch
    })
  }, [workouts, selectedMonth, selectedCategories])

  const totalPages = Math.ceil(filteredWorkouts.length / workoutsPerPage)

  // Calculate current workouts to display
  const indexOfLastWorkout = currentPage * workoutsPerPage
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage
  const currentWorkouts = filteredWorkouts.slice(indexOfFirstWorkout, indexOfLastWorkout)

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [selectedMonth, selectedCategories])

  // Load workouts data
  const loadWorkouts = async () => {
    try {
      const response = await fetch('/data/workouts.json')
      if (!response.ok) throw new Error('Failed to load workouts')
      const data = await response.json()
      setWorkouts(data.workouts)
    } catch (err) {
      console.error('Error loading workouts:', err)
      setError('Failed to load workouts. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadWorkouts()
  }, [])

  const handleRetry = () => {
    setError(null)
    setLoading(true)
    loadWorkouts()
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} onRetry={handleRetry} />

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <select
              id="month-filter"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Months</option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryChange(category)}
                  className={`px-3 py-1 text-xs rounded-full ${
                    selectedCategories.includes(category)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Workout Programs</h2>
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstWorkout + 1}-{Math.min(indexOfLastWorkout, filteredWorkouts.length)} of {filteredWorkouts.length} workouts
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {currentWorkouts.length > 0 ? (
          currentWorkouts.map((workout) => (
            <WorkoutCard key={workout.id} workout={workout} />
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No workouts match your selected filters
          </div>
        )}
      </div>

      {filteredWorkouts.length > workoutsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  )
}