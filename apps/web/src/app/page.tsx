import { fetchWorkouts, fetchWorkoutCategories } from '../services/workoutService';
import WorkoutsList from '../features/workouts/components/WorkoutsList';

/**
 * RootPage - Home page server component
 * This is a server component that fetches initial data before rendering.
 */
export default async function RootPage() {
  const initialPage = 1;
  const initialLimit = 20;

  // Fetch multiple data sources concurrently
  const [initialData, categories] = await Promise.all([
    fetchWorkouts(initialPage, initialLimit),
    fetchWorkoutCategories(),
  ]);

  // Render the home page with pre-fetched data
  return (
    <div className="home-page">
      <WorkoutsList
        initialData={initialData}
        initialPage={initialPage}
        categories={categories}
      />
    </div>
  );
}