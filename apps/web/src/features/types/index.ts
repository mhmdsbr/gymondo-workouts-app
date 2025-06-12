export type WorkoutDifficulty = 'beginner' | 'intermediate' | 'advanced'

export type Workout = {
  id: number
  name: string
  description: string
  startDate: string
  duration: number
  difficulty: WorkoutDifficulty
  category: string
  exercises: string[]
  equipment: string[]
  calories: number
}

// Props interfaces
export interface WorkoutCardProps {
  workout: Workout
}

export interface WorkoutDetailProps {
  slug: string
}

// Filter types
export interface WorkoutFilters {
  selectedMonth: string
  selectedCategories: string[]
}

// API response types
export interface WorkoutsApiResponse {
  workouts: Workout[]
}