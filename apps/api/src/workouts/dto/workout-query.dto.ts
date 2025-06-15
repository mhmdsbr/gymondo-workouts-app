import { IsOptional, IsString, IsArray, IsInt, Min, Max } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class WorkoutQueryDto {
  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  categories?: string[];

  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.toString())
  month?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number = 20;
}