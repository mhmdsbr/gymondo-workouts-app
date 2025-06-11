import styles from './page.module.css';
import Header from '../components/Header'
import WorkoutsList from '../components/WorkoutsList'

const RootPage = ({ params }: { params: { forTest?: boolean } }) => {
  return (
    <main className={styles.main}>
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
       <Header />
       <WorkoutsList />
      </main>
    </main>
  );
};

export default RootPage;
