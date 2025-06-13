import {
  Controller,
  Get,
  Query,
} from '@nestjs/common';
import { WorkoutsService } from './workouts.service';
import { WorkoutQueryDto } from './dto/workout-query.dto';

@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workoutsService: WorkoutsService) {}

  @Get()
  findAll(@Query() query: WorkoutQueryDto) {
    return this.workoutsService.findAll(query);
  }

  @Get('categories')
  getCategories() {
    return this.workoutsService.getCategories();
  }

}