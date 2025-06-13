'use client';

import { useState, useEffect } from 'react';
import WorkoutCard from './WorkoutCard';
import WorkoutFilters from './WorkoutFilters';
import Pagination from './WorkoutsPagination';
import LoadingSkeleton from '../../../shared/components/LoadingSkeleton';
import ErrorMessage from '../../../shared/components/ErrorMessage';
import { fetchWorkouts, fetchWorkoutCategories } from '../../../services/workoutService';
import { Workout } from '../../../shared/types';

export default function WorkoutsList() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedMonth, setSelectedMonth] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [allCategories, setAllCategories] = useState<string[]>([]);

  const loadWorkouts = async () => {
    try {
      setLoading(true);
      const data = await fetchWorkouts(
        currentPage,
        20,
        selectedMonth,
        selectedCategories
      );
      setWorkouts(data.workouts);
      setTotalPages(data.pagination.totalPages);
      setTotalItems(data.pagination.total);
    } catch (err) {
      console.error('Error loading workouts:', err);
      setError('Failed to load workouts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadCategories = async () => {
    try {
      const categories = await fetchWorkoutCategories();
      setAllCategories(categories);
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  useEffect(() => {
    loadWorkouts();
  }, [currentPage, selectedMonth, selectedCategories]);

  useEffect(() => {
    loadCategories();
  }, []);

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


  const handleRetry = () => {
    setError(null);
    loadWorkouts();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Calculate pagination info for display
  const startIndex = (currentPage - 1) * 20 + 1;
  const endIndex = Math.min(currentPage * 20, totalItems);

  if (loading && workouts.length === 0) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} onRetry={handleRetry} />;

  return (
    <section className="p-6 container mx-auto">
      <WorkoutFilters
        selectedMonth={selectedMonth}
        setSelectedMonth={handleMonthChange}
        selectedCategories={selectedCategories}
        allCategories={allCategories}
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
        {loading ? (
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