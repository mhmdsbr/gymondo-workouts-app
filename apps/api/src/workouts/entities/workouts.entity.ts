export class Workout {
  id: number;
  name: string;
  description: string;
  startDate: Date;
  duration: number;
  difficulty: string;
  category: string;
  exercises: string[];
  equipment: string[];
  calories: number;
  createdAt: Date;
  updatedAt: Date;
}