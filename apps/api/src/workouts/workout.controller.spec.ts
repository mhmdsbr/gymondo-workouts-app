import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsController } from './workouts.controller';
import { WorkoutsService } from './workouts.service';
import { WorkoutQueryDto } from './dto/workout-query.dto';

describe('WorkoutsController', () => {
  let controller: WorkoutsController;
  let service: WorkoutsService;

  const mockWorkoutsService = {
    findAll: jest.fn(),
    getCategories: jest.fn(),
    findOneBySlug: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkoutsController],
      providers: [
        { provide: WorkoutsService, useValue: mockWorkoutsService },
      ],
    }).compile();

    controller = module.get<WorkoutsController>(WorkoutsController);
    service = module.get<WorkoutsService>(WorkoutsService);

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    const mockPaginatedResult = {
      workouts: [
        { id: 1, title: 'Workout 1', slug: 'workout-1' },
        { id: 2, title: 'Workout 2', slug: 'workout-2' },
      ],
      pagination: {
        total: 2,
        page: 1,
        limit: 10,
        totalPages: 1,
        hasNext: false,
        hasPrev: false,
      },
    };

    it('should call service.findAll with empty query', async () => {
      const query: WorkoutQueryDto = {};
      mockWorkoutsService.findAll.mockResolvedValue(mockPaginatedResult);

      const response = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockPaginatedResult);
    });

    it('should call service.findAll with pagination parameters', async () => {
      const query: WorkoutQueryDto = { page: 2, limit: 5 };
      mockWorkoutsService.findAll.mockResolvedValue(mockPaginatedResult);

      const response = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(service.findAll).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockPaginatedResult);
    });

    it('should call service.findAll with category filter', async () => {
      const query: WorkoutQueryDto = {
        category: 'Strength',
        page: 1,
        limit: 10
      };
      mockWorkoutsService.findAll.mockResolvedValue(mockPaginatedResult);

      const response = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(response).toEqual(mockPaginatedResult);
    });

    it('should call service.findAll with categories array filter', async () => {
      const query: WorkoutQueryDto = {
        categories: ['Strength', 'Cardio'],
        month: '5'
      };
      mockWorkoutsService.findAll.mockResolvedValue(mockPaginatedResult);

      const response = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(response).toEqual(mockPaginatedResult);
    });

    it('should call service.findAll with all query parameters', async () => {
      const query: WorkoutQueryDto = {
        category: 'Strength',
        categories: ['Upper Body'],
        month: '3',
        page: 2,
        limit: 20
      };
      mockWorkoutsService.findAll.mockResolvedValue(mockPaginatedResult);

      const response = await controller.findAll(query);

      expect(service.findAll).toHaveBeenCalledWith(query);
      expect(response).toEqual(mockPaginatedResult);
    });

    it('should handle service errors', async () => {
      const query: WorkoutQueryDto = { page: 1, limit: 10 };
      const error = new Error('Database connection failed');
      mockWorkoutsService.findAll.mockRejectedValue(error);

      await expect(controller.findAll(query)).rejects.toThrow('Database connection failed');
      expect(service.findAll).toHaveBeenCalledWith(query);
    });
  });

  describe('getCategories', () => {
    it('should return categories from service', async () => {
      const mockCategories = ['Strength', 'Cardio', 'Flexibility', 'Sports'];
      mockWorkoutsService.getCategories.mockResolvedValue(mockCategories);

      const response = await controller.getCategories();

      expect(service.getCategories).toHaveBeenCalled();
      expect(service.getCategories).toHaveBeenCalledTimes(1);
      expect(service.getCategories).toHaveBeenCalledWith();
      expect(response).toEqual(mockCategories);
    });

    it('should return empty array when no categories exist', async () => {
      const mockCategories: string[] = [];
      mockWorkoutsService.getCategories.mockResolvedValue(mockCategories);

      const response = await controller.getCategories();

      expect(service.getCategories).toHaveBeenCalled();
      expect(response).toEqual([]);
    });

    it('should handle service errors', async () => {
      const error = new Error('Failed to fetch categories');
      mockWorkoutsService.getCategories.mockRejectedValue(error);

      await expect(controller.getCategories()).rejects.toThrow('Failed to fetch categories');
      expect(service.getCategories).toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    const mockWorkout = {
      id: 1,
      title: 'Sample Workout',
      slug: 'sample-workout',
      description: 'A great workout',
      category: 'Strength',
      startDate: new Date('2024-01-15'),
    };

    it('should return workout from service by slug', async () => {
      const slug = 'sample-workout';
      mockWorkoutsService.findOneBySlug.mockResolvedValue(mockWorkout);

      const response = await controller.findOne(slug);

      expect(service.findOneBySlug).toHaveBeenCalledWith(slug);
      expect(service.findOneBySlug).toHaveBeenCalledTimes(1);
      expect(response).toEqual(mockWorkout);
    });

    it('should handle different slug formats', async () => {
      const slug = 'complex-workout-name-123';
      mockWorkoutsService.findOneBySlug.mockResolvedValue(mockWorkout);

      const response = await controller.findOne(slug);

      expect(service.findOneBySlug).toHaveBeenCalledWith(slug);
      expect(response).toEqual(mockWorkout);
    });

    it('should return null when workout not found', async () => {
      const slug = 'non-existent-workout';
      mockWorkoutsService.findOneBySlug.mockResolvedValue(null);

      const response = await controller.findOne(slug);

      expect(service.findOneBySlug).toHaveBeenCalledWith(slug);
      expect(response).toBeNull();
    });

    it('should handle service errors', async () => {
      const slug = 'sample-workout';
      const error = new Error('Database query failed');
      mockWorkoutsService.findOneBySlug.mockRejectedValue(error);

      await expect(controller.findOne(slug)).rejects.toThrow('Database query failed');
      expect(service.findOneBySlug).toHaveBeenCalledWith(slug);
    });

    it('should handle empty slug parameter', async () => {
      const slug = '';
      mockWorkoutsService.findOneBySlug.mockResolvedValue(null);

      const response = await controller.findOne(slug);

      expect(service.findOneBySlug).toHaveBeenCalledWith('');
      expect(response).toBeNull();
    });
  });

  describe('service injection', () => {
    it('should inject WorkoutsService correctly', () => {
      expect(service).toEqual(mockWorkoutsService);
    });
  });
});