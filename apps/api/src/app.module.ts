import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WorkoutsModule } from './workouts/workout.module';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    WorkoutsModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}