import { IsOptional, IsString, IsArray, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';

export class WorkoutQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  categories?: string[];

  @IsOptional()
  @IsString()
  difficulty?: string;

  @IsOptional()
  @IsString()
  month?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 10;
}