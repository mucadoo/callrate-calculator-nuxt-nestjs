import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DddModule } from './ddd/ddd.module';
import { CallingPlanModule } from './calling-plan/calling-plan.module';
import { CallingRateModule } from './calling-rate/calling-rate.module';
import { PrismaModule } from './prisma/prisma.module';
import { CalculationModule } from './calculation/calculation.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    DddModule,
    CallingPlanModule,
    CallingRateModule,
    CalculationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

