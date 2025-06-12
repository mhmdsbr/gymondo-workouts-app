import Header from '../shared/Header'
import WorkoutsList from '../features/workouts/WorkoutsList'

const RootPage = () => {
  return (
    <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
      <Header />
      <WorkoutsList />
    </main>
  );
};

export default RootPage;