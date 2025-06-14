'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import type { WorkoutCardProps } from '../../../shared/types';

/**
 * WorkoutCard - Interactive card component displaying workout summary
 *
 * This is a client component that renders a clickable workout card with:
 * - Workout metadata (name, difficulty, category, dates)
 * - Performance metrics (duration, calories)
 * - Exercise and equipment lists
 * - Navigation to detailed workout view
 *
 * @param workout - Complete workout data object
 */
export default function WorkoutCard({ workout }: WorkoutCardProps) {
  // Next.js router for programmatic navigation
  const router = useRouter();

  /**
   * Maps difficulty levels to color-coded badges for visual hierarchy
   *
   * @param difficulty - Workout difficulty level (case-insensitive)
   * @returns Tailwind CSS classes for background and text colors
   */
  const getDifficultyBadgeColor = (difficulty: string) => {
    const normalizedDifficulty = difficulty.toLowerCase();
    switch (normalizedDifficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  /**
   * Handles card click navigation to workout detail page
   * Uses the workout slug to construct the detail page URL
   */
  const handleClick = () => {
    router.push(`/workouts/${workout.slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white hover:scale-[1.02] hover:shadow-md transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-semibold text-gray-900 mb-1">
          {workout.name}
        </h3>
      </div>
      <div className="flex items-center gap-2 mb-2">
        <span
          className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyBadgeColor(workout.difficulty)}`}
        >
          {workout.difficulty}
        </span>
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
          {workout.category}
        </span>
      </div>
      <p className="text-sm text-gray-500">
        Start Date: {dayjs(workout.startDate).format('MMMM D, YYYY')}
      </p>
      <div className="flex flex-col text-left my-2 text-sm text-gray-600">
        <div><span>Duration:</span> {workout.duration} min</div>
        <div><span>Calories:</span> {workout.calories} cal</div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Exercises:</h4>
          <p className="text-sm text-gray-600">
            {workout.exercises.join(', ')}
          </p>
        </div>
        <div>
          <h4 className="font-medium text-gray-900 mb-1">Equipment:</h4>
          <p className="text-sm text-gray-600">
            {workout.equipment.join(', ')}
          </p>
        </div>
      </div>
      <p className="text-gray-700 mb-4">{workout.description}</p>
    </div>
  );
}