'use client'

import { useState, useEffect } from 'react'
import WorkoutCard from './WorkoutCard'
import WorkoutFilters from './WorkoutFilters'
import Pagination from '../pagination/Pagination'
import LoadingSkeleton from '../../shared/LoadingSkeleton'
import ErrorMessage from '../../shared/ErrorMessage'
import { useWorkoutFilters, usePagination } from '../hooks'
import type { Workout, WorkoutsApiResponse } from '../types'

export default function WorkoutsList() {
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const {
    selectedMonth,
    setSelectedMonth,
    selectedCategories,
    allCategories,
    filteredWorkouts,
    handleCategoryChange,
  } = useWorkoutFilters(workouts)

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    paginatedItems: currentWorkouts,
    paginationInfo,
  } = usePagination(filteredWorkouts, 10)

  const loadWorkouts = async () => {
    try {
      const response = await fetch('/data/workouts.json')
      if (!response.ok) throw new Error('Failed to load workouts')
      const data: WorkoutsApiResponse = await response.json()
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

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} onRetry={handleRetry} />

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <WorkoutFilters
        selectedMonth={selectedMonth}
        setSelectedMonth={setSelectedMonth}
        selectedCategories={selectedCategories}
        allCategories={allCategories}
        handleCategoryChange={handleCategoryChange}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Workout Programs</h2>
        <div className="text-sm text-gray-600">
          Showing {paginationInfo.startIndex}-{paginationInfo.endIndex} of {paginationInfo.totalItems} workouts
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

      {filteredWorkouts.length > 10 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </section>
  )
}