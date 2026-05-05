import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CallingPlanModule } from './calling-plan/calling-plan.module';
import { CallingRateModule } from './calling-rate/calling-rate.module';
import { PrismaModule } from './prisma/prisma.module';
import { CalculationModule } from './calculation/calculation.module';
import { CountryModule } from './country/country.module';
import { ProviderModule } from './provider/provider.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    CallingPlanModule,
    CallingRateModule,
    CalculationModule,
    CountryModule,
    ProviderModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

