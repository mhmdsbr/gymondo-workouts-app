import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom';
import WorkoutDetail from '../src/features/workouts/components/WorkoutDetail'
import { Workout } from '../src/shared/types'

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) =>
    <a href={href}>{children}</a>
})

jest.mock('dayjs', () => {
  const mockDayjs = jest.fn(() => ({
    format: jest.fn(() => 'January 15, 2024')
  }))
  return mockDayjs
})

describe('WorkoutDetail Component', () => {
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

  test('renders workout details correctly', () => {
    render(<WorkoutDetail workout={mockWorkout} />)

    expect(screen.getByText('Morning Cardio')).toBeInTheDocument()

    expect(screen.getByText('Intermediate')).toBeInTheDocument()

    expect(screen.getByText('Cardio')).toBeInTheDocument()

    expect(screen.getByText('A high-energy morning workout to start your day')).toBeInTheDocument()

    expect(screen.getByText('30 minutes')).toBeInTheDocument()
    expect(screen.getByText('250 cal')).toBeInTheDocument()
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument()

    expect(screen.getByText('Jumping Jacks')).toBeInTheDocument()
    expect(screen.getByText('Burpees')).toBeInTheDocument()
    expect(screen.getByText('Mountain Climbers')).toBeInTheDocument()

    expect(screen.getByText('Yoga Mat')).toBeInTheDocument()
    expect(screen.getByText('Water Bottle')).toBeInTheDocument()

    expect(screen.getByText('← Back to Workouts List')).toBeInTheDocument()
  })
  test('applies correct difficulty badge styling', () => {

    render(<WorkoutDetail workout={mockWorkout} />)
    const intermediateBadge = screen.getByText('Intermediate')
    expect(intermediateBadge).toHaveClass('bg-yellow-100', 'text-yellow-800')

    const beginnerWorkout: Workout = { ...mockWorkout, difficulty: 'Beginner' }
    render(<WorkoutDetail workout={beginnerWorkout} />)
    const beginnerBadge = screen.getByText('Beginner')
    expect(beginnerBadge).toHaveClass('bg-green-100', 'text-green-800')

    const advancedWorkout: Workout = { ...mockWorkout, difficulty: 'Advanced' }
    render(<WorkoutDetail workout={advancedWorkout} />)
    const advancedBadge = screen.getByText('Advanced')
    expect(advancedBadge).toHaveClass('bg-red-100', 'text-red-800')
  })
})