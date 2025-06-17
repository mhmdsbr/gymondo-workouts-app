import { getDifficultyColors } from '../src/features/workouts/utils';
import { beginnerWorkout, advancedWorkout, intermediateWorkout, unknownWorkout } from './mocks/workoutMock';

describe('getDifficultyColors utility function', () => {
  test('returns correct colors for beginner difficulty', () => {
    const result = getDifficultyColors(beginnerWorkout.difficulty);
    expect(result).toBe('bg-green-100 text-green-800');
  });

  test('returns correct colors for intermediate difficulty', () => {
    const result = getDifficultyColors(intermediateWorkout.difficulty);
    expect(result).toBe('bg-yellow-100 text-yellow-800');
  });

  test('returns correct colors for advanced difficulty', () => {
    const result = getDifficultyColors(advancedWorkout.difficulty);
    expect(result).toBe('bg-red-100 text-red-800');
  });

  test('returns default colors for unknown difficulty', () => {
    const result = getDifficultyColors(unknownWorkout.difficulty);
    expect(result).toBe('bg-gray-100 text-gray-800');
  });
});