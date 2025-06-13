export interface Workout {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  duration: number;
  difficulty: string;
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

export interface WorkoutDetailProps {
  slug: string;
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

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface Month {
  value: string;
  label: string;
}