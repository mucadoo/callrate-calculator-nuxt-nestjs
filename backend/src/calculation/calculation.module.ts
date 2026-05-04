import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CalculationController } from './calculation.controller';
import { CalculationService } from './calculation.service';

@Module({
  imports: [PrismaModule],
  controllers: [CalculationController],
  providers: [CalculationService],
})
export class CalculationModule {}
