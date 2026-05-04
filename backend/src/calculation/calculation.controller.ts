import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { CalculationService } from './calculation.service';

@Controller('calculation')
export class CalculationController {
  constructor(private readonly calculationService: CalculationService) {}

  @Get()
  calculate(
    @Query('originDDDId', ParseIntPipe) originDDDId: number,
    @Query('destinationDDDId', ParseIntPipe) destinationDDDId: number,
    @Query('minutes', ParseIntPipe) minutes: number,
    @Query('callingPlanId', ParseIntPipe) callingPlanId: number,
  ) {
    return this.calculationService.calculate(originDDDId, destinationDDDId, minutes, callingPlanId);
  }
}
