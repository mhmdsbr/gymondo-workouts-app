import WorkoutDetail from "../../../features/workouts/components/WorkoutDetail";

export default function WorkoutDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  return <WorkoutDetail slug={params.slug} />;
}