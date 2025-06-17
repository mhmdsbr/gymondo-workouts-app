import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootPage from '../src/app/page'
import { fetchWorkouts, fetchWorkoutCategories } from '../src/services/workoutService';
import WorkoutsList from '../src/features/workouts/components/WorkoutsList';
import {Workout, WorkoutsApiResponse} from '../src/shared/types';

jest.mock('../src/services/workoutService', () => ({
  fetchWorkouts: jest.fn(),
  fetchWorkoutCategories: jest.fn(),
}));

jest.mock('../src/features/workouts/components/WorkoutsList', () => {
  return jest.fn(({ initialData, initialPage, pageLimit, categories }) => (
    <div data-testid="workouts-list">
      <div data-testid="initial-data">{JSON.stringify(initialData)}</div>
      <div data-testid="initial-page">{initialPage}</div>
      <div data-testid="page-limit">{pageLimit}</div>
      <div data-testid="categories">{JSON.stringify(categories)}</div>
    </div>
  ));
});

const mockFetchWorkouts = fetchWorkouts as jest.MockedFunction<typeof fetchWorkouts>;
const mockFetchWorkoutCategories = fetchWorkoutCategories as jest.MockedFunction<typeof fetchWorkoutCategories>;
const MockedWorkoutsList = WorkoutsList as jest.MockedFunction<typeof WorkoutsList>;

describe('RootPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockWorkout = (id: number): Workout => ({
    id,
    name: `Workout ${id}`,
    slug: `workout-${id}`,
    description: `Description ${id}`,
    startDate: new Date(),
    duration: 30,
    difficulty: 'intermediate',
    category: 'Strength',
    exercises: ['Exercise 1', 'Exercise 2'],
    equipment: ['Dumbbells', 'Mat'],
    calories: 300
  });

  const createMockResponse = (page: number, limit: number, total: number): WorkoutsApiResponse => ({
    workouts: Array(limit).fill(0).map((_, i) => createMockWorkout(page * limit + i + 1)),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit) - 1,
      hasPrev: page > 0
    }
  });

  it('should render the home page with correct structure', async () => {
    // Arrange
    const mockWorkoutsData = createMockResponse(0, 2, 50);
    const mockCategories = ['Strength', 'Cardio'];

    mockFetchWorkouts.mockResolvedValue(mockWorkoutsData);
    mockFetchWorkoutCategories.mockResolvedValue(mockCategories);

    // Act
    const component = await RootPage();
    render(component);

    // Assert
    expect(screen.getByTestId('workouts-list')).toBeInTheDocument();
    expect(screen.getByTestId('initial-data')).toHaveTextContent(JSON.stringify(mockWorkoutsData));
    expect(screen.getByTestId('categories')).toHaveTextContent(JSON.stringify(mockCategories));
  });

  it('should call fetchWorkouts with correct parameters', async () => {
    // Arrange
    const mockWorkoutsData = createMockResponse(0, 20, 0);
    const mockCategories: string[] = [];

    mockFetchWorkouts.mockResolvedValue(mockWorkoutsData);
    mockFetchWorkoutCategories.mockResolvedValue(mockCategories);

    // Act
    await RootPage();

    // Assert
    expect(mockFetchWorkouts).toHaveBeenCalledWith(1, 20);
    expect(mockFetchWorkouts).toHaveBeenCalledTimes(1);
  });

  it('should pass correct props to WorkoutsList component', async () => {
    // Arrange
    const mockWorkoutsData = createMockResponse(0, 1, 25);
    const mockCategories = ['Strength', 'Flexibility'];

    mockFetchWorkouts.mockResolvedValue(mockWorkoutsData);
    mockFetchWorkoutCategories.mockResolvedValue(mockCategories);

    // Act
    const component = await RootPage();
    render(component);

    // Assert
    expect(MockedWorkoutsList).toHaveBeenCalledWith({
      initialData: mockWorkoutsData,
      initialPage: 1,
      pageLimit: 20,
      categories: mockCategories
    }, {});
  });

  it('should handle empty data gracefully', async () => {
    // Arrange
    const emptyWorkoutsData = createMockResponse(0, 0, 0);
    const emptyCategories: string[] = [];

    mockFetchWorkouts.mockResolvedValue(emptyWorkoutsData);
    mockFetchWorkoutCategories.mockResolvedValue(emptyCategories);

    // Act
    const component = await RootPage();
    render(component);

    // Assert
    expect(MockedWorkoutsList).toHaveBeenCalledWith({
      initialData: emptyWorkoutsData,
      initialPage: 1,
      pageLimit: 20,
      categories: emptyCategories
    }, {});
    expect(screen.getByTestId('workouts-list')).toBeInTheDocument();
  });
});