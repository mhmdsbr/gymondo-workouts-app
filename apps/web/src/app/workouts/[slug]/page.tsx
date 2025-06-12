import WorkoutDetail from "../../../features/workouts/WorkoutDetail";

export default function WorkoutDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <WorkoutDetail slug={params.slug} />;
}