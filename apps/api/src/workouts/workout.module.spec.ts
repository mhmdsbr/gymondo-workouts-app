import { Test, TestingModule } from '@nestjs/testing';
import { WorkoutsModule } from './workout.module';
import { WorkoutsService } from './workouts.service';
import { WorkoutsController } from './workouts.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('WorkoutsModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [WorkoutsModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have WorkoutsController', () => {
    const controller = module.get<WorkoutsController>(WorkoutsController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(WorkoutsController);
  });

  it('should have WorkoutsService', () => {
    const service = module.get<WorkoutsService>(WorkoutsService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(WorkoutsService);
  });

  it('should have PrismaService', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
    expect(prismaService).toBeInstanceOf(PrismaService);
  });

  it('should export WorkoutsService', () => {
    const service = module.get<WorkoutsService>(WorkoutsService);
    expect(service).toBeDefined();

    expect(() => module.get<WorkoutsService>(WorkoutsService)).not.toThrow();
  });

  it('should properly wire dependencies', () => {
    const controller = module.get<WorkoutsController>(WorkoutsController);
    const service = module.get<WorkoutsService>(WorkoutsService);

    expect(controller).toBeDefined();
    expect(service).toBeDefined();

    expect(controller).toHaveProperty('workoutsService');
  });
});