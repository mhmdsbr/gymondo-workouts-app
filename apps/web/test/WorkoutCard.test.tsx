import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkoutCard from '../src/features/workouts/components/WorkoutCard';
import { mockWorkout } from './mocks/workoutMock';

const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush
  })
}));

jest.mock('dayjs', () => {
  const mockDayjs = jest.fn(() => ({
    format: jest.fn(() => 'January 15, 2024')
  }));
  return mockDayjs;
});

describe('WorkoutCard Component', () => {
  beforeEach(() => {
    mockPush.mockClear();
  });

  test('renders workout card with all data', () => {
    render(<WorkoutCard workout={mockWorkout} />);

    expect(screen.getByText('Morning Cardio')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
    expect(screen.getByText('A high-energy morning workout to start your day')).toBeInTheDocument();

    expect(screen.getByText('30 min')).toBeInTheDocument();
    expect(screen.getByText('250 cal')).toBeInTheDocument();
    expect(screen.getByText('Start Date: January 15, 2024')).toBeInTheDocument();

    expect(screen.getByText('Jumping Jacks, Burpees, Mountain Climbers')).toBeInTheDocument();
    expect(screen.getByText('Yoga Mat, Water Bottle')).toBeInTheDocument();
  });

  test('navigates to workout detail on click', () => {
    render(<WorkoutCard workout={mockWorkout} />);

    const card = screen.getByTestId('workout-card');
    fireEvent.click(card);

    expect(mockPush).toHaveBeenCalledWith('/workouts/morning-cardio');
  });
});