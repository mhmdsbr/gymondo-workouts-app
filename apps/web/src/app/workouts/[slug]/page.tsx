import { fetchWorkoutBySlug } from "../../../services/workoutService";
import WorkoutDetail from "../../../features/workouts/components/WorkoutDetail";

/**
 * WorkoutDetailPage - Individual workout detail page
 * This server component fetches a specific workout by its slug parameter.
 *
 * @param params - Route parameters containing the workout slug
 */
export default async function WorkoutDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  // Fetch the specific workout using the slug from the URL
  const workout = await fetchWorkoutBySlug(params.slug);

  // Render the workout detail page with the fetched data
  return <WorkoutDetail workout={workout} />;
}