import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CallingPlanController } from './calling-plan.controller';
import { CallingPlanService } from './calling-plan.service';

@Module({
  imports: [PrismaModule],
  controllers: [CallingPlanController],
  providers: [CallingPlanService],
})
export class CallingPlanModule {}
