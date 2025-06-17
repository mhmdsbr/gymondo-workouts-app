import { Difficulty } from '../../../shared/types'

export const getDifficultyColors = (difficulty: string) => {
  const colors: Record<Difficulty, string> = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-yellow-100 text-yellow-800',
    advanced: 'bg-red-100 text-red-800',
  };

  const key = difficulty.toLowerCase() as Difficulty;
  return colors[key] || 'bg-gray-100 text-gray-800';
};
