'use client'

import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import Link from 'next/link'
import type { Workout, WorkoutDetailProps, WorkoutsApiResponse } from '../types'

export default function WorkoutDetail({ slug }: WorkoutDetailProps) {
  const [workout, setWorkout] = useState<Workout | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        const response = await fetch('/data/workouts.json')
        if (!response.ok) throw new Error('Failed to load workouts')
        const data: WorkoutsApiResponse = await response.json()

        const foundWorkout = data.workouts.find((w: Workout) => {
          const workoutSlug = w.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
          return workoutSlug === slug
        })

        if (!foundWorkout) throw new Error('Workout not found')
        setWorkout(foundWorkout)
      } catch (err) {
        console.error('Error loading workout:', err)
        setError(err instanceof Error ? err.message : 'Failed to load workout')
      } finally {
        setLoading(false)
      }
    }

    fetchWorkout()
  }, [slug])

  if (loading) return <div className="p-6 max-w-4xl mx-auto">Loading...</div>
  if (error)
    return <div className="p-6 max-w-4xl mx-auto text-red-500">{error}</div>
  if (!workout)
    return <div className="p-6 max-w-4xl mx-auto">Workout not found</div>

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link
        href="/"
        className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
      >
        ← Back to Workouts List
      </Link>

      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          {workout.name}
        </h1>

        <div className="flex items-center gap-4 mb-4">
          <span
            className={`px-3 py-1 rounded-full text-sm font-medium ${
              workout.difficulty.toLowerCase() === 'beginner'
                ? 'bg-green-100 text-green-800'
                : workout.difficulty.toLowerCase() === 'intermediate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
            }`}
          >
            {workout.difficulty}
          </span>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {workout.category}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Details</h2>
            <div className="space-y-2">
              <p>
                <span className="font-medium">Start Date:</span>{' '}
                {dayjs(workout.startDate).format('MMMM D, YYYY')}
              </p>
              <p>
                <span className="font-medium">Duration:</span>{' '}
                {workout.duration} minutes
              </p>
              <p>
                <span className="font-medium">Calories:</span>{' '}
                {workout.calories} cal
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Description</h2>
            <p className="text-gray-700">{workout.description}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="text-lg font-semibold mb-2">Exercises</h2>
            <ul className="list-disc pl-5 space-y-1">
              {workout.exercises.map((exercise, index) => (
                <li key={index}>{exercise}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">Required Equipment</h2>
            <ul className="list-disc pl-5 space-y-1">
              {workout.equipment.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}