import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkoutQueryDto } from './dto/workout-query.dto';

@Injectable()
export class WorkoutsService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: WorkoutQueryDto) {
    const {
      categories,
      category,
      month,
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

  async getCategories(): Promise<string[]> {
    const categories = await this.prisma.workout.findMany({
      select: { category: true },
      distinct: ['category'],
    });

    return categories.map(item => item.category);
  }

  async findOneBySlug(slug: string) {
    return this.prisma.workout.findUnique({
      where: { slug },
    });
  }

}