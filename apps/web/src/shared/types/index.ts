export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface Workout {
  id: number;
  name: string;
  slug: string;
  description: string;
  startDate: Date;
  duration: number;
  difficulty: Difficulty;
  category: string;
  exercises: string[];
  equipment: string[];
  calories: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface WorkoutsApiResponse {
  workouts: Workout[];
  pagination: PaginationInfo;
}

export interface WorkoutFiltersProps {
  selectedMonth: string;
  setSelectedMonth: (month: string) => void;
  selectedCategories: string[];
  allCategories: string[];
  handleCategoryChange: (category: string) => void;
}

export interface WorkoutCardProps {
  workout: Workout;
}

export interface WorkoutsListProps {
  initialData: WorkoutsApiResponse;
  initialPage: number;
  categories: string[];
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface Month {
  value: string;
  label: string;
}

export interface BadgeProps {
  children: React.ReactNode;
  variant: 'difficulty' | 'category' | 'default';
  difficulty?: string;
  size?: 'sm' | 'md';
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}