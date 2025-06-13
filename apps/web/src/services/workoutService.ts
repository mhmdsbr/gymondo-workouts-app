'use client';

import { Workout, WorkoutsApiResponse } from '../shared/types'


const API_BASE_URL = 'http://localhost:3000/api/workouts';

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

  const response = await fetch(`${API_BASE_URL}?${params.toString()}`);
  if (!response.ok) throw new Error('Failed to load workouts');
  return response.json();
};

export const fetchAllWorkouts = async (): Promise<Workout[]> => {
  const response = await fetch(`${API_BASE_URL}?limit=1000`);
  if (!response.ok) throw new Error('Failed to load workouts');
  const data = await response.json();
  return data.workouts;
};

export const fetchWorkoutCategories = async (): Promise<string[]> => {
  const response = await fetch(`${API_BASE_URL}/categories`);
  if (!response.ok) throw new Error('Failed to load categories');
  return response.json();
};

export const findWorkoutBySlug = async (slug: string): Promise<Workout | undefined> => {
  const workouts = await fetchAllWorkouts();
  return workouts.find((w) => {
    const workoutSlug = w.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    return workoutSlug === slug;
  });
};