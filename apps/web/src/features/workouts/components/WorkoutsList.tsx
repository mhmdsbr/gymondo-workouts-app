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

export default function WorkoutsList({
  initialData,
  initialPage,
  categories,
}: WorkoutsListProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const isInitialState = currentPage === 1 && !selectedMonth && selectedCategories.length === 0;

  const queryKey = [
    'workouts',
    currentPage,
    selectedMonth,
    selectedCategories.join(','),
  ];

  const { data, error, isLoading, mutate } = useSWR<WorkoutsApiResponse>(
    isInitialState ? null : queryKey,
    () => fetchWorkouts(currentPage, PAGE_LIMIT, selectedMonth, selectedCategories),
    {
      keepPreviousData: true,
    }
  );

  const workoutsData = isInitialState ? initialData : data;

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

  if (!isInitialState && isLoading && !data?.workouts.length) return <LoadingSkeleton />;
  if (!isInitialState && error) return <ErrorMessage error="Failed to load workouts" onRetry={handleRetry} />;

  const workouts = workoutsData?.workouts ?? [];
  const totalPages = workoutsData?.pagination.totalPages ?? 1;
  const totalItems = workoutsData?.pagination.total ?? 0;
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