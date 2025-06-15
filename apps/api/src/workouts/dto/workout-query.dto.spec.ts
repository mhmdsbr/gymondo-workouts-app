import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import 'reflect-metadata';
import { WorkoutQueryDto } from './workout-query.dto';

describe('WorkoutQueryDto', () => {
  it('should validate and transform a full valid input', async () => {
    const input = {
      category: 'Strength',
      categories: ['Upper Body', 'Full Body'],
      month: '5',
      page: '2',
      limit: '15',
    };

    const dto = plainToInstance(WorkoutQueryDto, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(15);
    expect(dto.categories).toEqual(['Upper Body', 'Full Body']);
    expect(dto.category).toBe('Strength');
    expect(dto.month).toBe('5');
  });

  it('should transform single categories value into an array', async () => {
    const input = {
      categories: 'Cardio',
    };

    const dto = plainToInstance(WorkoutQueryDto, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.categories).toEqual(['Cardio']);
  });

  it('should return errors for non-numeric page and limit', async () => {
    const input = {
      page: 'not-a-number',
      limit: 'also-wrong',
    };

    const dto = plainToInstance(WorkoutQueryDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);

    const pageErrors = errors.find(err => err.property === 'page');
    const limitErrors = errors.find(err => err.property === 'limit');
    expect(pageErrors).toBeDefined();
    expect(limitErrors).toBeDefined();
  });

  it('should reject page values less than 1', async () => {
    const input = { page: '0' };

    const dto = plainToInstance(WorkoutQueryDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const pageError = errors.find(err => err.property === 'page');
    expect(pageError?.constraints).toHaveProperty('min');
  });

  it('should reject limit values greater than 100', async () => {
    const input = { limit: '150' };

    const dto = plainToInstance(WorkoutQueryDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const limitError = errors.find(err => err.property === 'limit');
    expect(limitError?.constraints).toHaveProperty('max');
  });

  it('should reject limit values less than 1', async () => {
    const input = { limit: '0' };

    const dto = plainToInstance(WorkoutQueryDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const limitError = errors.find(err => err.property === 'limit');
    expect(limitError?.constraints).toHaveProperty('min');
  });

  it('should reject non-string values in categories array', async () => {
    const input = { categories: ['Valid', 123, 'AlsoValid'] };

    const dto = plainToInstance(WorkoutQueryDto, input);
    const errors = await validate(dto);

    expect(errors.length).toBeGreaterThan(0);
    const categoriesError = errors.find(err => err.property === 'categories');
    expect(categoriesError).toBeDefined();
  });

  it('should accept valid boundary values', async () => {
    const input = {
      page: '1',
      limit: '50',
    };

    const dto = plainToInstance(WorkoutQueryDto, input);
    const errors = await validate(dto);

    expect(errors).toHaveLength(0);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(50);
  });
});