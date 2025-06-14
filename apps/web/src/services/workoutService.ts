import { Workout, WorkoutsApiResponse } from '../shared/types'

// Base API URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api/workouts';

/**
 * Fetches paginated workouts with optional filtering
 *
 * This function handles the main workout listing with support for:
 * - Pagination (page/limit)
 * - Month-based filtering
 * - Category-based filtering (multiple categories supported)
 *
 * @param page - Page number for pagination (default: 1)
 * @param limit - Number of workouts per page (default: 10)
 * @param month - Optional month filter (e.g., "2024-01")
 * @param categories - Optional array of category names to filter by
 * @returns Promise resolving to paginated workout data with metadata
 */
export const fetchWorkouts = async (
  page: number = 1,
  limit: number = 10,
  month?: string,
  categories?: string[]
): Promise<WorkoutsApiResponse> => {
  // Build query parameters for the API request
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  // Add optional month filter if provided
  if (month) params.append('month', month);

  // Add category filters - multiple categories are supported
  // Each category is added as a separate 'categories' parameter
  if (categories && categories.length > 0) {
    categories.forEach(category => params.append('categories', category));
  }

  // Make the API request with no-store cache to ensure fresh data
  const res = await fetch(`${API_BASE_URL}?${params.toString()}`, {
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('Failed to fetch workouts');

  return res.json();
};

/**
 * Fetches all available workout categories
 *
 * Used for populating filter dropdowns and category selection UIs.
 * Returns a simple array of category names.
 *
 * @returns Promise resolving to array of category names
 */
export const fetchWorkoutCategories = async (): Promise<string[]> => {
  // Fetch categories from dedicated endpoint
  const res = await fetch(`${API_BASE_URL}/categories`, {
    cache: 'no-store'
  });

  if (!res.ok) throw new Error('Failed to fetch categories');

  return res.json();
};

/**
 * Fetches a single workout by its unique slug
 *
 * Used for workout detail pages where the slug comes from the URL parameter.
 *
 * @param slug - Unique identifier for the workout (e.g., "morning-cardio-blast")
 * @returns Promise resolving to complete workout data
 */
export const fetchWorkoutBySlug = async (slug: string): Promise<Workout> => {
  // Fetch specific workout using slug parameter
  // Note: This uses default caching behavior
  const response = await fetch(`${API_BASE_URL}/${slug}`);

  if (!response.ok) throw new Error('Failed to load workout');

  return response.json();
};