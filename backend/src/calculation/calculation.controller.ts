import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { CalculationService } from './calculation.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('calculation')
@Controller('calculation')
export class CalculationController {
  constructor(private readonly calculationService: CalculationService) {}

  @Get()
  @ApiOperation({ summary: 'Calculate call cost with and without plan' })
  @ApiQuery({ name: 'originDDDId', type: Number })
  @ApiQuery({ name: 'destinationDDDId', type: Number })
  @ApiQuery({ name: 'minutes', type: Number })
  @ApiQuery({ name: 'callingPlanId', type: Number })
  calculate(
    @Query('originDDDId', ParseIntPipe) originDDDId: number,
    @Query('destinationDDDId', ParseIntPipe) destinationDDDId: number,
    @Query('minutes', ParseIntPipe) minutes: number,
    @Query('callingPlanId', ParseIntPipe) callingPlanId: number,
  ) {
    return this.calculationService.calculate(originDDDId, destinationDDDId, minutes, callingPlanId);
  }
}
