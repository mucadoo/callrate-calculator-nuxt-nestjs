import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { CallingRateController } from './calling-rate.controller';
import { CallingRateService } from './calling-rate.service';

@Module({
  imports: [PrismaModule],
  controllers: [CallingRateController],
  providers: [CallingRateService],
})
export class CallingRateModule {}
