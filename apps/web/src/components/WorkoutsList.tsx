'use client'

import { useState, useEffect } from 'react'
import WorkoutCard from './WorkOutCard'
import Pagination from './Pagination'
import LoadingSkeleton from './LoadingSkeleton'
import ErrorMessage from './ErrorMessage'

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

  const workoutsPerPage = 10
  const totalPages = Math.ceil(workouts.length / workoutsPerPage)

  // Calculate current workouts to display
  const indexOfLastWorkout = currentPage * workoutsPerPage
  const indexOfFirstWorkout = indexOfLastWorkout - workoutsPerPage
  const currentWorkouts = workouts.slice(indexOfFirstWorkout, indexOfLastWorkout)

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

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorMessage error={error} onRetry={handleRetry} />

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Workout Programs</h2>
        <div className="text-sm text-gray-600">
          Showing {indexOfFirstWorkout + 1}-{Math.min(indexOfLastWorkout, workouts.length)} of {workouts.length} workouts
        </div>
      </div>

      <div className="space-y-4 mb-8">
        {currentWorkouts.map((workout) => (
          <WorkoutCard key={workout.id} workout={workout} />
        ))}
      </div>

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  )
}