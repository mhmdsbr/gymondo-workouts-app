import { IsString, IsInt, IsArray, IsDateString, Min, Max } from 'class-validator';

export class CreateWorkoutDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsDateString()
  startDate: string;

  @IsInt()
  @Min(1)
  @Max(300)
  duration: number;

  @IsString()
  difficulty: string;

  @IsString()
  category: string;

  @IsArray()
  @IsString({ each: true })
  exercises: string[];

  @IsArray()
  @IsString({ each: true })
  equipment: string[];

  @IsInt()
  @Min(0)
  calories: number;
}
