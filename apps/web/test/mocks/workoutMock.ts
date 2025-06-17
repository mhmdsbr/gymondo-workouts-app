import { Workout, Difficulty } from '../../src/shared/types';

export const mockWorkout: Workout = {
  id: 1,
  name: 'Morning Cardio',
  slug: 'morning-cardio',
  difficulty: 'intermediate' as Difficulty,
  category: 'Cardio',
  description: 'A high-energy morning workout to start your day',
  startDate: new Date('2024-01-15'),
  duration: 30,
  calories: 250,
  exercises: ['Jumping Jacks', 'Burpees', 'Mountain Climbers'],
  equipment: ['Yoga Mat', 'Water Bottle']
};

export const beginnerWorkout: Workout = {
  ...mockWorkout,
  difficulty: 'beginner' as Difficulty
};

export const intermediateWorkout: Workout = {
  ...mockWorkout,
  difficulty: 'intermediate' as Difficulty
};

export const advancedWorkout: Workout = {
  ...mockWorkout,
  difficulty: 'advanced' as Difficulty
};

export const unknownWorkout: Workout = {
  ...mockWorkout,
  difficulty: 'unknown' as any
};