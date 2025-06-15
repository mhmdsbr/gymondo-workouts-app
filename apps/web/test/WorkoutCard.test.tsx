import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'
import WorkoutCard from '../src/features/workouts/components/WorkoutCard'
import { Workout } from '../src/shared/types'

const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}))

jest.mock('dayjs', () => {
  const mockDayjs = jest.fn(() => ({
    format: jest.fn(() => 'January 15, 2024')
  }))
  return mockDayjs
})

describe('WorkoutCard Component', () => {
  const mockWorkout: Workout = {
    id: 1,
    name: 'Morning Cardio',
    slug: 'morning-cardio',
    difficulty: 'Intermediate',
    category: 'Cardio',
    description: 'A high-energy morning workout to start your day',
    startDate: new Date('2024-01-15'),
    duration: 30,
    calories: 250,
    exercises: ['Jumping Jacks', 'Burpees', 'Mountain Climbers'],
    equipment: ['Yoga Mat', 'Water Bottle']
  }

  beforeEach(() => {
    mockPush.mockClear()
  })

  test('renders workout card with all data', () => {
    render(<WorkoutCard workout={mockWorkout} />)

    expect(screen.getByText('Morning Cardio')).toBeInTheDocument()
    expect(screen.getByText('Intermediate')).toBeInTheDocument()
    expect(screen.getByText('Cardio')).toBeInTheDocument()
    expect(screen.getByText('A high-energy morning workout to start your day')).toBeInTheDocument()

    expect(screen.getByText('30 min')).toBeInTheDocument()
    expect(screen.getByText('250 cal')).toBeInTheDocument()
    expect(screen.getByText('Start Date: January 15, 2024')).toBeInTheDocument()

    expect(screen.getByText('Jumping Jacks, Burpees, Mountain Climbers')).toBeInTheDocument()
    expect(screen.getByText('Yoga Mat, Water Bottle')).toBeInTheDocument()
  })

  test('navigates to workout detail on click', () => {
    render(<WorkoutCard workout={mockWorkout} />)

    const card = screen.getByTestId('workout-card')
    fireEvent.click(card)

    expect(mockPush).toHaveBeenCalledWith('/workouts/morning-cardio')
  })

  test('applies correct difficulty badge colors', () => {

    render(<WorkoutCard workout={mockWorkout} />)
    const intermediateBadge = screen.getByText('Intermediate')
    expect(intermediateBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')

    const beginnerWorkout: Workout = { ...mockWorkout, difficulty: 'Beginner' }
    render(<WorkoutCard workout={beginnerWorkout} />)
    const beginnerBadge = screen.getByText('Beginner')
    expect(beginnerBadge).toHaveClass('bg-green-100', 'text-green-800')

    const advancedWorkout: Workout = { ...mockWorkout, difficulty: 'Advanced' }
    render(<WorkoutCard workout={advancedWorkout} />)
    const advancedBadge = screen.getByText('Advanced')
    expect(advancedBadge).toHaveClass('bg-red-100', 'text-red-800')

    const unknownWorkout: Workout = { ...mockWorkout, difficulty: 'Unknown' }
    render(<WorkoutCard workout={unknownWorkout} />)
    const unknownBadge = screen.getByText('Unknown')
    expect(unknownBadge).toHaveClass('bg-gray-100', 'text-gray-800')
  })

})