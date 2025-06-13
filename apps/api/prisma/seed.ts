import { PrismaClient } from '@prisma/client';
import { faker } from '@faker-js/faker';

const prisma = new PrismaClient();

const CATEGORIES = [
  "Full Body", "Core", "Upper Body", "Lower Body",
  "Cardio", "Flexibility", "Strength", "Endurance"
];

const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced"];

const ALL_EXERCISES = [
  "Burpees", "Push-ups", "Squats", "Mountain Climbers",
  "Plank", "Russian Twists", "Dead Bug", "Bird Dog",
  "Bench Press", "Pull-ups", "Shoulder Press", "Dips",
  "Jump Squats", "High Knees", "Burpee Tuck Jumps", "Sprint Intervals",
  "Deadlifts", "Lunges", "Calf Raises", "Sun Salutation",
  "Warrior Poses", "Downward Dog", "Child's Pose"
];

const ALL_EQUIPMENT = [
  "None", "Yoga Mat", "Dumbbells", "Pull-up Bar",
  "Barbell", "Kettlebells", "Resistance Bands"
];

function capitalize(str: string): string {
  return str[0].toUpperCase() + str.slice(1);
}

function generateWorkout() {

  const description = faker.lorem.paragraphs(3);

  const exerciseCount = faker.number.int({ min: 5, max: 8 });
  const exercises = Array.from({ length: exerciseCount }, () =>
    faker.helpers.arrayElement(ALL_EXERCISES)
  );

  const equipmentCount = faker.number.int({ min: 1, max: 3 });
  let equipment = Array.from({ length: equipmentCount }, () =>
    faker.helpers.arrayElement(ALL_EQUIPMENT)
  );

  if (equipment.includes("None")) {
    equipment = ["None"];
  } else {
    equipment = [...new Set(equipment)];
  }

  return {
    name: `${capitalize(faker.word.adjective())} ${capitalize(faker.word.noun())} Workout`,
    description,
    startDate: faker.date.future(),
    duration: faker.number.int({ min: 15, max: 90 }),
    difficulty: faker.helpers.arrayElement(DIFFICULTIES),
    category: faker.helpers.arrayElement(CATEGORIES),
    exercises,
    equipment,
    calories: faker.number.int({ min: 100, max: 800 })
  };
}

async function checkWorkoutSizes() {
  // Sample 10 random workouts to check their sizes
  const sampleWorkouts = await prisma.workout.findMany({
    take: 10,
    skip: Math.floor(Math.random() * 900),
  });

  console.log('\nWorkout Size Report:');
  console.log('-------------------');

  sampleWorkouts.forEach((workout, index) => {
    const sizeInBytes = Buffer.byteLength(JSON.stringify(workout), 'utf8');
    const sizeInKB = sizeInBytes / 1024;

    console.log(
      `Workout ${index + 1}: "${workout.name}"\n` +
      `- Size: ${sizeInKB.toFixed(2)}KB\n` +
      `- Exercises: ${workout.exercises.length}\n` +
      `- Description: ${workout.description.length.toLocaleString()} chars\n`
    );
  });

  const avgSize = sampleWorkouts.reduce((sum, workout) => {
    return sum + (Buffer.byteLength(JSON.stringify(workout), 'utf8') / 1024);
  }, 0) / sampleWorkouts.length;

  console.log(`Average workout size: ${avgSize.toFixed(2)}KB`);
  console.log('-------------------\n');
}

async function main() {
  console.log('Starting database seed...');

  await prisma.workout.deleteMany({});
  console.log('Cleared existing workouts');

  const workoutCount = 1000;
  const workouts = [];

  console.log(`⏳ Generating ${workoutCount} workouts...`);
  for (let i = 0; i < workoutCount; i++) {
    workouts.push(generateWorkout());
    if (i % 100 === 0) process.stdout.write('.');
  }
  console.log('\n');

  // Batch insert in chunks of 100
  const batchSize = 100;
  for (let i = 0; i < workouts.length; i += batchSize) {
    const batch = workouts.slice(i, i + batchSize);
    await prisma.workout.createMany({
      data: batch,
    });
    console.log(`Inserted batch ${i / batchSize + 1} of ${Math.ceil(workouts.length / batchSize)}`);
  }

  console.log(`Successfully seeded ${workoutCount} workouts`);

  await checkWorkoutSizes();
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });