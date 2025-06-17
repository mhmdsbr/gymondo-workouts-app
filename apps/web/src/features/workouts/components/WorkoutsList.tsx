'use client';

import useSWR from 'swr';
import { useState, useEffect } from 'react';
import WorkoutCard from './WorkoutCard';
import WorkoutFilters from './WorkoutFilters';
import Pagination from './WorkoutsPagination';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { Spinner } from '../../../shared/components/Spinner';
import { fetchWorkouts } from '../../../services/workoutService';
import { WorkoutsListProps, WorkoutsApiResponse } from '../../../shared/types';

const PAGE_LIMIT = 20;
const DEBOUNCE_DELAY = 300;

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
 * Shows a spinner for filter state transitions, and LoadingSkeleton for initial load
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

  // Debounced states
  const [debouncedMonth, setDebouncedMonth] = useState(selectedMonth);
  const [debouncedCategories, setDebouncedCategories] = useState<string[]>([]);
  const [isClientLoaded, setIsClientLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Debounce month input changes
  useEffect(() => {
    if (!isClientLoaded && selectedMonth === '') return;
    setIsTransitioning(true);
    const handler = setTimeout(() => {
      setDebouncedMonth(selectedMonth);
      setIsTransitioning(false);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [selectedMonth]);

  // Debounce category selection changes
  useEffect(() => {
    if (!isClientLoaded && selectedCategories.length === 0) return;
    setIsTransitioning(true);
    const handler = setTimeout(() => {
      setDebouncedCategories(selectedCategories);
      setIsTransitioning(false);
    }, DEBOUNCE_DELAY);
    return () => clearTimeout(handler);
  }, [selectedCategories]);

  // Trigger initial client load detection
  useEffect(() => {
    setIsClientLoaded(true);
  }, []);

  // Optimization: detect if we're in initial state to avoid unnecessary API calls
  // Uses server-provided data when no filters are applied
  const isInitialState =
    currentPage === 1 && !debouncedMonth && debouncedCategories.length === 0;

  // SWR query key - changes when any filter parameter changes
  // This triggers automatic revalidation when filters are modified
  const queryKey = [
    'workouts',
    currentPage,
    debouncedMonth || 'all-months',
    debouncedCategories.length > 0
      ? debouncedCategories.join(',')
      : 'all-categories',
  ];

  // SWR data fetching with conditional execution
  // Only fetches when not in initial state (has filters applied)
  const { data, error, mutate } = useSWR<WorkoutsApiResponse>(
    isInitialState ? null : queryKey, // null key disables SWR when in initial state
    () =>
      fetchWorkouts(
        currentPage,
        PAGE_LIMIT,
        debouncedMonth,
        debouncedCategories,
      ),
    { keepPreviousData: true }, // Prevents UI flicker during transitions
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
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category],
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

  // Main Loading state while initial server data is being shown
  if (!isClientLoaded) return <LoadingSkeleton />;

  // Main Error state
  if (!isInitialState && error)
    return (
      <ErrorMessage error="Failed to load workouts" onRetry={handleRetry} />
    );

  // Data extraction with safe fallbacks
  const workouts = workoutsData?.workouts ?? [];
  const totalPages = workoutsData?.pagination.totalPages ?? 1;
  const totalItems = workoutsData?.pagination.total ?? 0;

  // Calculate display range for "Showing X-Y of Z" text
  const startIndex = (currentPage - 1) * PAGE_LIMIT + 1;
  const endIndex = Math.min(currentPage * PAGE_LIMIT, totalItems);

  return (
    <section className="p-6 container mx-auto" data-testid="workouts-loaded">
      <WorkoutFilters
        selectedMonth={selectedMonth}
        setSelectedMonth={handleMonthChange}
        selectedCategories={selectedCategories}
        allCategories={categories}
        handleCategoryChange={handleCategoryChange}
      />

      <div className="flex flex-col gap-3 md:flex-row md:gap-0 justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Workout Programs</h2>
        <div className="flex justify-center items-center gap-3 text-sm text-gray-600">
          {isTransitioning ? <Spinner size="sm" /> : null}
          {totalItems > 0 ? (
            <>
              Showing {startIndex}-{endIndex} of {totalItems} workouts
            </>
          ) : (
            'No workouts found'
          )}
        </div>
      </div>

      {isTransitioning ? (
        <div className="flex justify-center py-12">
          <Spinner size='lg' />
        </div>
      ) : (
        <>
          <div className="mb-8">
            {workouts.length > 0 ? (
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
        </>
      )}
    </section>
  );
}
