import { Workout, WorkoutsApiResponse } from '../shared/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/workouts';

export const fetchWorkouts = async (
  page: number = 1,
  limit: number = 10,
  month?: string,
  categories?: string[]
): Promise<WorkoutsApiResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (month) params.append('month', month);
  if (categories && categories.length > 0) {
    categories.forEach(category => params.append('categories', category));
  }

  const res = await fetch(`${API_BASE_URL}?${params.toString()}`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch workouts');
  return res.json();
};

export const fetchWorkoutCategories = async (): Promise<string[]> => {
  const res = await fetch(`${API_BASE_URL}/categories`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
};

export const fetchWorkoutBySlug = async (slug: string): Promise<Workout> => {
  const response = await fetch(`${API_BASE_URL}/${slug}`);
  if (!response.ok) throw new Error('Failed to load workout');
  return response.json();
};