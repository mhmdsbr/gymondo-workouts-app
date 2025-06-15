import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsService } from './workouts.service';
import { PrismaService } from '../../prisma/prisma.service';
import { WorkoutQueryDto } from './dto/workout-query.dto';

describe('WorkoutsService', () => {
  let service: WorkoutsService;
  let prisma: PrismaService;

  const mockPrisma = {
    workout: {
      count: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
  };

  const mockWorkoutData = [
    {
      id: 1,
      title: 'Morning Cardio',
      slug: 'morning-cardio',
      category: 'Cardio',
      startDate: new Date('2024-03-15'),
    },
    {
      id: 2,
      title: 'Strength Training',
      slug: 'strength-training',
      category: 'Strength',
      startDate: new Date('2024-03-16'),
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkoutsService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();

    service = module.get<WorkoutsService>(WorkoutsService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('findAll', () => {
    beforeEach(() => {
      mockPrisma.workout.count.mockResolvedValue(10);
      mockPrisma.workout.findMany.mockResolvedValue(mockWorkoutData);
    });

    it('should return paginated workouts with default pagination', async () => {
      const query: WorkoutQueryDto = {};

      const result = await service.findAll(query);

      expect(prisma.workout.count).toHaveBeenCalledWith({ where: {} });
      expect(prisma.workout.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { startDate: 'asc' },
      });
      expect(result).toEqual({
        workouts: mockWorkoutData,
        pagination: {
          total: 10,
          page: 1,
          limit: 10,
          totalPages: 1,
          hasNext: false,
          hasPrev: false,
        },
      });
    });

    it('should return paginated workouts with custom pagination', async () => {
      const query: WorkoutQueryDto = { page: 2, limit: 5 };
      mockPrisma.workout.count.mockResolvedValue(15);

      const result = await service.findAll(query);

      expect(prisma.workout.count).toHaveBeenCalledWith({ where: {} });
      expect(prisma.workout.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 5,
        take: 5,
        orderBy: { startDate: 'asc' },
      });
      expect(result).toEqual({
        workouts: mockWorkoutData,
        pagination: {
          total: 15,
          page: 2,
          limit: 5,
          totalPages: 3,
          hasNext: true,
          hasPrev: true,
        },
      });
    });

    it('should filter by single category', async () => {
      const query: WorkoutQueryDto = { category: 'Strength' };

      await service.findAll(query);

      expect(prisma.workout.count).toHaveBeenCalledWith({
        where: { category: 'Strength' },
      });
      expect(prisma.workout.findMany).toHaveBeenCalledWith({
        where: { category: 'Strength' },
        skip: 0,
        take: 10,
        orderBy: { startDate: 'asc' },
      });
    });

    it('should filter by multiple categories', async () => {
      const query: WorkoutQueryDto = { categories: ['Strength', 'Cardio'] };

      await service.findAll(query);

      expect(prisma.workout.count).toHaveBeenCalledWith({
        where: { category: { in: ['Strength', 'Cardio'] } },
      });
      expect(prisma.workout.findMany).toHaveBeenCalledWith({
        where: { category: { in: ['Strength', 'Cardio'] } },
        skip: 0,
        take: 10,
        orderBy: { startDate: 'asc' },
      });
    });

    it('should prioritize categories array over single category', async () => {
      const query: WorkoutQueryDto = {
        category: 'Yoga',
        categories: ['Strength', 'Cardio']
      };

      await service.findAll(query);

      expect(prisma.workout.count).toHaveBeenCalledWith({
        where: { category: { in: ['Strength', 'Cardio'] } },
      });
    });

    it('should filter by month', async () => {
      const query: WorkoutQueryDto = { month: '3' };
      const currentYear = new Date().getFullYear();

      await service.findAll(query);

      const expectedStartOfMonth = new Date(currentYear, 2, 1);
      const expectedEndOfMonth = new Date(currentYear, 3, 0, 23, 59, 59);

      expect(prisma.workout.count).toHaveBeenCalledWith({
        where: {
          startDate: {
            gte: expectedStartOfMonth,
            lte: expectedEndOfMonth,
          },
        },
      });
    });

    it('should handle combined filters', async () => {
      const query: WorkoutQueryDto = {
        categories: ['Strength'],
        month: '5',
        page: 2,
        limit: 20,
      };
      const currentYear = new Date().getFullYear();

      await service.findAll(query);

      expect(prisma.workout.count).toHaveBeenCalledWith({
        where: {
          category: { in: ['Strength'] },
          startDate: {
            gte: new Date(currentYear, 4, 1),
            lte: new Date(currentYear, 5, 0, 23, 59, 59),
          },
        },
      });
      expect(prisma.workout.findMany).toHaveBeenCalledWith({
        where: {
          category: { in: ['Strength'] },
          startDate: {
            gte: new Date(currentYear, 4, 1),
            lte: new Date(currentYear, 5, 0, 23, 59, 59),
          },
        },
        skip: 20,
        take: 20,
        orderBy: { startDate: 'asc' },
      });
    });

    it('should handle empty categories array', async () => {
      const query: WorkoutQueryDto = { categories: [] };

      await service.findAll(query);

      expect(prisma.workout.count).toHaveBeenCalledWith({ where: {} });
      expect(prisma.workout.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { startDate: 'asc' },
      });
    });

    it('should calculate pagination correctly for edge cases', async () => {
      const query: WorkoutQueryDto = { page: 1, limit: 3 };
      mockPrisma.workout.count.mockResolvedValue(3);

      const result = await service.findAll(query);

      expect(result.pagination).toEqual({
        total: 3,
        page: 1,
        limit: 3,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      });
    });

    it('should handle database errors', async () => {
      const query: WorkoutQueryDto = {};
      const error = new Error('Database connection failed');
      mockPrisma.workout.count.mockRejectedValue(error);

      await expect(service.findAll(query)).rejects.toThrow('Database connection failed');
      expect(prisma.workout.count).toHaveBeenCalled();
    });
  });

  describe('getCategories', () => {
    it('should return distinct categories', async () => {
      const mockData = [
        { category: 'Cardio' },
        { category: 'Strength' },
        { category: 'Flexibility' },
      ];
      mockPrisma.workout.findMany.mockResolvedValue(mockData);

      const result = await service.getCategories();

      expect(prisma.workout.findMany).toHaveBeenCalledWith({
        select: { category: true },
        distinct: ['category'],
      });
      expect(prisma.workout.findMany).toHaveBeenCalledTimes(1);
      expect(result).toEqual(['Cardio', 'Strength', 'Flexibility']);
    });

    it('should return empty array when no categories exist', async () => {
      mockPrisma.workout.findMany.mockResolvedValue([]);

      const result = await service.getCategories();

      expect(prisma.workout.findMany).toHaveBeenCalledWith({
        select: { category: true },
        distinct: ['category'],
      });
      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const error = new Error('Failed to fetch categories');
      mockPrisma.workout.findMany.mockRejectedValue(error);

      await expect(service.getCategories()).rejects.toThrow('Failed to fetch categories');
      expect(prisma.workout.findMany).toHaveBeenCalled();
    });
  });

  describe('findOneBySlug', () => {
    it('should return workout by slug', async () => {
      const slug = 'sample-workout';
      const mockWorkout = {
        id: 1,
        title: 'Sample Workout',
        slug: 'sample-workout',
        category: 'Strength',
        startDate: new Date('2024-03-15'),
      };

      mockPrisma.workout.findUnique.mockResolvedValue(mockWorkout);

      const result = await service.findOneBySlug(slug);

      expect(prisma.workout.findUnique).toHaveBeenCalledWith({
        where: { slug },
      });
      expect(prisma.workout.findUnique).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockWorkout);
    });

    it('should return null when workout not found', async () => {
      const slug = 'non-existent-workout';
      mockPrisma.workout.findUnique.mockResolvedValue(null);

      const result = await service.findOneBySlug(slug);

      expect(prisma.workout.findUnique).toHaveBeenCalledWith({
        where: { slug },
      });
      expect(result).toBeNull();
    });

    it('should handle different slug formats', async () => {
      const slug = 'complex-workout-name-with-numbers-123';
      const mockWorkout = { id: 1, slug };
      mockPrisma.workout.findUnique.mockResolvedValue(mockWorkout);

      const result = await service.findOneBySlug(slug);

      expect(prisma.workout.findUnique).toHaveBeenCalledWith({
        where: { slug },
      });
      expect(result).toEqual(mockWorkout);
    });

    it('should handle empty slug', async () => {
      const slug = '';
      mockPrisma.workout.findUnique.mockResolvedValue(null);

      const result = await service.findOneBySlug(slug);

      expect(prisma.workout.findUnique).toHaveBeenCalledWith({
        where: { slug: '' },
      });
      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const slug = 'sample-workout';
      const error = new Error('Database query failed');
      mockPrisma.workout.findUnique.mockRejectedValue(error);

      await expect(service.findOneBySlug(slug)).rejects.toThrow('Database query failed');
      expect(prisma.workout.findUnique).toHaveBeenCalledWith({
        where: { slug },
      });
    });
  });

  describe('prisma integration', () => {
    it('should inject PrismaService correctly', () => {
      expect(prisma).toEqual(mockPrisma);
    });
  });
});