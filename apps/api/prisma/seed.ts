import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const workoutData = [
  {
    name: "Full Body Blast",
    description: "A high-intensity full body circuit workout combining strength training and cardio elements. Perfect for burning calories and building lean muscle mass.",
    startDate: new Date("2025-06-10"),
    duration: 45,
    difficulty: "Intermediate",
    category: "Full Body",
    exercises: ["Burpees", "Push-ups", "Squats", "Mountain Climbers"],
    equipment: ["None"],
    calories: 400
  },
  {
    name: "Core Strength Builder",
    description: "Focuses on abdominal and lower back muscles to improve posture and stability. Great for developing a strong foundation for all other exercises.",
    startDate: new Date("2025-06-12"),
    duration: 30,
    difficulty: "Beginner",
    category: "Core",
    exercises: ["Plank", "Russian Twists", "Dead Bug", "Bird Dog"],
    equipment: ["Yoga Mat"],
    calories: 200
  },
  {
    name: "Upper Body Pump",
    description: "Targets chest, shoulders, and arms with progressive overload techniques. Build impressive upper body strength and definition.",
    startDate: new Date("2025-06-14"),
    duration: 50,
    difficulty: "Advanced",
    category: "Upper Body",
    exercises: ["Bench Press", "Pull-ups", "Shoulder Press", "Dips"],
    equipment: ["Dumbbells", "Pull-up Bar"],
    calories: 350
  },
  {
    name: "HIIT Cardio Crusher",
    description: "High-intensity interval training designed to maximize fat burn and improve cardiovascular endurance in minimal time.",
    startDate: new Date("2025-06-16"),
    duration: 25,
    difficulty: "Advanced",
    category: "Cardio",
    exercises: ["Jump Squats", "High Knees", "Burpee Tuck Jumps", "Sprint Intervals"],
    equipment: ["None"],
    calories: 300
  },
  {
    name: "Lower Body Power",
    description: "Comprehensive leg workout focusing on glutes, quads, hamstrings, and calves. Build explosive power and strength in your lower body.",
    startDate: new Date("2025-06-18"),
    duration: 55,
    difficulty: "Intermediate",
    category: "Lower Body",
    exercises: ["Squats", "Deadlifts", "Lunges", "Calf Raises"],
    equipment: ["Barbell", "Dumbbells"],
    calories: 450
  },
  {
    name: "Yoga Flow Morning",
    description: "Gentle morning yoga sequence to wake up your body and mind. Perfect for improving flexibility and starting your day with mindfulness.",
    startDate: new Date("2025-06-20"),
    duration: 40,
    difficulty: "Beginner",
    category: "Flexibility",
    exercises: ["Sun Salutation", "Warrior Poses", "Downward Dog", "Child's Pose"],
    equipment: ["Yoga Mat"],
    calories: 150
  }
];

async function main() {
  console.log('🌱 Starting database seed...');

  await prisma.workout.deleteMany({});
  console.log('🗑️  Cleared existing workouts');

  const workouts = await prisma.workout.createMany({
    data: workoutData,
  });

  console.log(`✅ Seeded ${workouts.count} workouts`);

  const allWorkouts = await prisma.workout.findMany();
  console.log('📋 Created workouts:');
  allWorkouts.forEach(workout => {
    console.log(`   - ${workout.name} (${workout.category})`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });