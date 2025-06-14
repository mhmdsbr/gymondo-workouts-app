'use client';

import useSWR from 'swr';
import { useState } from 'react';
import WorkoutCard from './WorkoutCard';
import WorkoutFilters from './WorkoutFilters';
import Pagination from './WorkoutsPagination';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { fetchWorkouts } from '../../../services/workoutService';
import { WorkoutsListProps, WorkoutsApiResponse } from '../../../shared/types';

const PAGE_LIMIT = 20;

/**
 *
 * This is a client component that manages:
 * - Server-side initial data with client-side filtering
 * - SWR-based data fetching with caching and revalidation
 * - Multi-dimensional filtering (month + categories)
 * - Pagination with URL state management
 * - Loading and error states
 * - Smart data fetching optimization (avoids unnecessary requests)
 *
 * Uses a hybrid approach: displays server-side initial data for performance,
 * then switches to client-side SWR fetching when filters are applied.
 *
 * @param initialData - Pre-fetched workout data from server component
 * @param initialPage - Starting page number from server
 * @param categories - Available workout categories for filtering
 */
export default function WorkoutsList({
  initialData,
  initialPage,
  categories,
}: WorkoutsListProps) {
  // State management for filtering and pagination
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  // Optimization: detect if we're in initial state to avoid unnecessary API calls
  // Uses server-provided data when no filters are applied
  const isInitialState = currentPage === 1 && !selectedMonth && selectedCategories.length === 0;

  // SWR query key - changes when any filter parameter changes
  // This triggers automatic revalidation when filters are modified
  const queryKey = [
    'workouts',
    currentPage,
    selectedMonth,
    selectedCategories.join(','), // Convert array to string for key stability
  ];

  // SWR data fetching with conditional execution
  // Only fetches when not in initial state (has filters applied)
  const { data, error, isLoading, mutate } = useSWR<WorkoutsApiResponse>(
    isInitialState ? null : queryKey, // null key disables SWR when in initial state
    () => fetchWorkouts(currentPage, PAGE_LIMIT, selectedMonth, selectedCategories),
    {
      keepPreviousData: true, // Prevents UI flicker during transitions
    }
  );

  // Data source selection: use initial server data or SWR fetched data
  const workoutsData = isInitialState ? initialData : data;

  /**
   * Handles category filter toggle
   * Toggles category selection and resets to first page
   *
   * @param category - Category name to toggle
   */
  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)  // Remove if already selected
        : [...prev, category]               // Add if not selected
    );
    setCurrentPage(1); // Reset to first page when filter changes
  };

  /**
   * Handles month filter change
   * Updates month selection and resets to first page
   *
   * @param month - Month value to filter by
   */
  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  /**
   * Handles pagination navigation
   *
   * @param page - Target page number
   */
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  /**
   * Handles retry action for failed requests
   * Triggers SWR revalidation
   */
  const handleRetry = () => {
    mutate();
  };

  // Main Loading state
  if (!isInitialState && isLoading && !data?.workouts.length) return <LoadingSkeleton />;

  // Main Error state
  if (!isInitialState && error) return <ErrorMessage error="Failed to load workouts" onRetry={handleRetry} />;

  // Data extraction with safe fallbacks
  const workouts = workoutsData?.workouts ?? [];
  const totalPages = workoutsData?.pagination.totalPages ?? 1;
  const totalItems = workoutsData?.pagination.total ?? 0;

  // Calculate display range for "Showing X-Y of Z" text
  const startIndex = (currentPage - 1) * PAGE_LIMIT + 1;
  const endIndex = Math.min(currentPage * PAGE_LIMIT, totalItems);

  return (
    <section className="p-6 container mx-auto">
      <WorkoutFilters
        selectedMonth={selectedMonth}
        setSelectedMonth={handleMonthChange}
        selectedCategories={selectedCategories}
        allCategories={categories}
        handleCategoryChange={handleCategoryChange}
      />

      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Workout Programs</h2>
        <div className="text-sm text-gray-600">
          {totalItems > 0 ? (
            <>Showing {startIndex}-{endIndex} of {totalItems} workouts</>
          ) : (
            'No workouts found'
          )}
        </div>
      </div>

      <div className="mb-8">
        {!isInitialState && isLoading ? (
          // Loading spinner for filtered data fetching
          <div className="text-center py-4">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : workouts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {workouts.map((workout) => (
              <WorkoutCard key={workout.id} workout={workout} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            No workouts match your selected filters
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </section>
  );
}