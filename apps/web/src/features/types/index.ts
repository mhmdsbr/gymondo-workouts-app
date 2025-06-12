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

export interface WorkoutCardProps {
  workout: Workout
}

export interface WorkoutFiltersProps {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  selectedCategories: string[]
  allCategories: string[]
  handleCategoryChange: (category: string) => void
}

export interface WorkoutDetailProps {
  slug: string
}

export interface WorkoutFilters {
  selectedMonth: string
  selectedCategories: string[]
}

export interface WorkoutsApiResponse {
  workouts: Workout[]
}