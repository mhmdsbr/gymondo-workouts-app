import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import WorkoutDetail from '../src/features/workouts/components/WorkoutDetail';
import { mockWorkout } from './mocks/workoutMock';

jest.mock('next/link', () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) =>
    <a href={href}>{children}</a>
});

jest.mock('dayjs', () => {
  const mockDayjs = jest.fn(() => ({
    format: jest.fn(() => 'January 15, 2024')
  }));
  return mockDayjs;
});

describe('WorkoutDetail Component', () => {
  test('renders workout details correctly', () => {
    render(<WorkoutDetail workout={mockWorkout} />);

    expect(screen.getByText('Morning Cardio')).toBeInTheDocument();
    expect(screen.getByText('intermediate')).toBeInTheDocument();
    expect(screen.getByText('Cardio')).toBeInTheDocument();
    expect(screen.getByText('A high-energy morning workout to start your day')).toBeInTheDocument();
    expect(screen.getByText('30 minutes')).toBeInTheDocument();
    expect(screen.getByText('250 cal')).toBeInTheDocument();
    expect(screen.getByText('January 15, 2024')).toBeInTheDocument();

    expect(screen.getByText('Jumping Jacks')).toBeInTheDocument();
    expect(screen.getByText('Burpees')).toBeInTheDocument();
    expect(screen.getByText('Mountain Climbers')).toBeInTheDocument();

    expect(screen.getByText('Yoga Mat')).toBeInTheDocument();
    expect(screen.getByText('Water Bottle')).toBeInTheDocument();

    expect(screen.getByText('← Back to Workouts List')).toBeInTheDocument();
  });
});