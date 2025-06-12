import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpdateWorkoutDto } from './dto/update-workout.dto';
import { WorkoutQueryDto } from './dto/workout-query.dto';
import { Workout } from './entities/workouts.entity';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async create(createWorkoutDto: CreateWorkoutDto): Promise<Workout> {
    return this.prisma.workout.create({
      data: {
        ...createWorkoutDto,
        startDate: new Date(createWorkoutDto.startDate),
      },
    });
  }

  async findAll(query: WorkoutQueryDto) {
    const {
      categories,
      category,
      difficulty,
      month,
      startDate,
      search,
      page = 1,
      limit = 10
    } = query;

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    // Category filter
    if (categories && categories.length > 0) {
      where.category = { in: categories };
    } else if (category) {
      where.category = category;
    }

    // Difficulty filter
    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Month filter
    if (month) {
      const year = new Date().getFullYear();
      const monthNum = parseInt(month);
      const startOfMonth = new Date(year, monthNum - 1, 1);
      const endOfMonth = new Date(year, monthNum, 0, 23, 59, 59);

      where.startDate = {
        gte: startOfMonth,
        lte: endOfMonth,
      };
    }

    // Start date filter
    if (startDate) {
      where.startDate = {
        gte: new Date(startDate),
      };
    }

    // Search filter
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    // Get total count for pagination
    const total = await this.prisma.workout.count({ where });

    // Get workouts with pagination
    const workouts = await this.prisma.workout.findMany({
      where,
      skip,
      take: limit,
      orderBy: { startDate: 'asc' },
    });

    return {
      workouts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    };
  }

  async findOne(id: number): Promise<Workout> {
    const workout = await this.prisma.workout.findUnique({
      where: { id },
    });

    if (!workout) {
      throw new NotFoundException(`Workout with ID ${id} not found`);
    }

    return workout;
  }

  async update(id: number, updateWorkoutDto: UpdateWorkoutDto): Promise<Workout> {
    // Check if workout exists
    await this.findOne(id);

    const updateData: any = { ...updateWorkoutDto };
    if (updateWorkoutDto.startDate) {
      updateData.startDate = new Date(updateWorkoutDto.startDate);
    }

    return this.prisma.workout.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: number): Promise<void> {
    // Check if workout exists
    await this.findOne(id);

    await this.prisma.workout.delete({
      where: { id },
    });
  }

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.workout.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return categories.map(item => item.category);
  }

  async getDifficulties(): Promise<string[]> {
    const difficulties = await this.prisma.workout.findMany({
      select: { difficulty: true },
      distinct: ['difficulty'],
    });

    return difficulties.map(item => item.difficulty);
  }
}