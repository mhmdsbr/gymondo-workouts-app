import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { PrismaService } from '../prisma/prisma.service';
import { WorkoutsService } from './workouts/workouts.service';
import { WorkoutsController } from './workouts/workouts.controller';

describe('AppModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();
  });

  afterEach(async () => {
    await module.close();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should have ConfigModule imported globally', () => {
    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeDefined();
    expect(configService).toBeInstanceOf(ConfigService);
  });

  it('should have WorkoutsModule imported', () => {

    const workoutsService = module.get<WorkoutsService>(WorkoutsService);
    const workoutsController = module.get<WorkoutsController>(WorkoutsController);

    expect(workoutsService).toBeDefined();
    expect(workoutsController).toBeDefined();
  });

  it('should have PrismaService as provider', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
    expect(prismaService).toBeInstanceOf(PrismaService);
  });

  it('should have global access to ConfigService', () => {

    const configService = module.get<ConfigService>(ConfigService);
    expect(configService).toBeDefined();

    const configService2 = module.get<ConfigService>(ConfigService);
    expect(configService).toBe(configService2);
  });

  it('should properly initialize all modules and services', () => {

    const prismaService = module.get<PrismaService>(PrismaService);
    const configService = module.get<ConfigService>(ConfigService);
    const workoutsService = module.get<WorkoutsService>(WorkoutsService);

    expect(prismaService).toBeDefined();
    expect(configService).toBeDefined();
    expect(workoutsService).toBeDefined();
  });

  it('should have PrismaService available to WorkoutsModule', () => {

    const workoutsService = module.get<WorkoutsService>(WorkoutsService);
    const prismaService = module.get<PrismaService>(PrismaService);

    expect(workoutsService).toBeDefined();
    expect(prismaService).toBeDefined();

    expect(workoutsService).toBeInstanceOf(WorkoutsService);
    expect(prismaService).toBeInstanceOf(PrismaService);
  });

  describe('Module Structure', () => {
    it('should have correct module imports', () => {

      expect(() => {
        module.get<ConfigService>(ConfigService);
        module.get<WorkoutsService>(WorkoutsService);
        module.get<PrismaService>(PrismaService);
      }).not.toThrow();
    });

    it('should allow ConfigService to be injected anywhere due to global flag', () => {
      const configService = module.get<ConfigService>(ConfigService);

      expect(configService).toBeDefined();
      expect(typeof configService.get).toBe('function');
    });
  });
});