'use client';

import dayjs from 'dayjs';
import { useRouter } from 'next/navigation';
import type { WorkoutCardProps, WorkoutDifficulty } from '../types';

export default function WorkoutCard({ workout }: WorkoutCardProps) {
  const router = useRouter();

  const getDifficultyBadgeColor = (difficulty: WorkoutDifficulty) => {
    const normalizedDifficulty = difficulty.toLowerCase() as WorkoutDifficulty;
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

  const handleClick = () => {
    const slug = workout.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    router.push(`/workouts/${slug}`);
  };

  return (
    <div
      onClick={handleClick}
      className="p-6 border border-gray-200 rounded-xl shadow-sm bg-white hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 mb-1">
            {workout.name}
          </h3>
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
        </div>
        <div className="text-right text-sm text-gray-600">
          <div>{workout.duration} min</div>
          <div>{workout.calories} cal</div>
        </div>
      </div>

      <p className="text-gray-700 mb-4">{workout.description}</p>

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

      <p className="text-sm text-gray-500">
        Start Date: {dayjs(workout.startDate).format('MMMM D, YYYY')}
      </p>
    </div>
  );
}
