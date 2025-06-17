import useSWR from 'swr';
import { fetchWorkouts } from '../../../services/workoutService';
import { WorkoutsApiResponse } from '../../../shared/types';

export function useWorkoutsQuery({
  currentPage,
  debouncedMonth,
  debouncedCategories,
  initialData,
}: {
  currentPage: number;
  debouncedMonth: string;
  debouncedCategories: string[];
  initialData: WorkoutsApiResponse;
}) {
  const isInitialState =
    currentPage === 1 && !debouncedMonth && debouncedCategories.length === 0;

  const queryKey = [
    'workouts',
    currentPage,
    debouncedMonth || 'all-months',
    debouncedCategories.length > 0
      ? debouncedCategories.join(',')
      : 'all-categories',
  ];

  const { data, error, mutate } = useSWR<WorkoutsApiResponse>(
    isInitialState ? null : queryKey,
    () => fetchWorkouts(currentPage, 20, debouncedMonth, debouncedCategories),
    { keepPreviousData: true },
  );

  const workoutsData = isInitialState ? initialData : data;

  return { workoutsData, isInitialState, error, mutate };
}
