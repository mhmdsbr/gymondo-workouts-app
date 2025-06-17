'use client'

import { useState } from 'react';
import WorkoutCard from './WorkoutCard';
import WorkoutFilters from './WorkoutFilters';
import Pagination from './WorkoutsPagination';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { Spinner } from '../../../shared/components/Spinner';
import { useDebouncedFilters, useWorkoutsQuery, useWorkoutDisplayRange } from '../hooks/';
import { WorkoutsListProps } from '../../../shared/types';

export default function WorkoutsList({
  initialData,
  initialPage,
  pageLimit,
  categories,
}: WorkoutsListProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const {
    selectedMonth,
    setSelectedMonth,
    selectedCategories,
    setSelectedCategories,
    debouncedMonth,
    debouncedCategories,
    isClientLoaded,
    isTransitioning
  } = useDebouncedFilters();

  const {
    workoutsData,
    isInitialState,
    error,
    mutate
  } = useWorkoutsQuery({
    currentPage,
    debouncedMonth,
    debouncedCategories,
    initialData
  });

  const workouts = workoutsData?.workouts ?? [];
  const totalPages = workoutsData?.pagination.totalPages ?? 1;
  const totalItems = workoutsData?.pagination.total ?? 0;

  const { startIndex, endIndex } = useWorkoutDisplayRange(currentPage, pageLimit, totalItems);

  const handleCategoryChange = (category: string) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
    setCurrentPage(1);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRetry = () => {
    mutate();
  };

  if (!isClientLoaded) return <LoadingSkeleton />;
  if (!isInitialState && error) {
    return (
      <ErrorMessage error="Failed to load workouts" onRetry={handleRetry} />
    );
  }

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
          {isTransitioning && <Spinner size="sm" />}
          {totalItems > 0
            ? <>Showing {startIndex}-{endIndex} of {totalItems} workouts</>
            : 'No workouts found'}
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
