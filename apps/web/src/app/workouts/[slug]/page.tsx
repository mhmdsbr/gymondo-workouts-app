import { fetchWorkoutBySlug } from "../../../services/workoutService";
import WorkoutDetail from "../../../features/workouts/components/WorkoutDetail";

export default async function WorkoutDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const workout = await fetchWorkoutBySlug(params.slug);

  return <WorkoutDetail workout={workout} />;
}