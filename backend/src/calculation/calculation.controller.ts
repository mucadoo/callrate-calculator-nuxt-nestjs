import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { CalculationService } from './calculation.service';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

@ApiTags('calculation')
@Controller('calculation')
export class CalculationController {
  constructor(private readonly calculationService: CalculationService) {}

  @Get()
  @ApiOperation({ summary: 'Compare call costs across providers for a destination country' })
  @ApiQuery({ name: 'destinationCountryId', type: Number })
  @ApiQuery({ name: 'minutes', type: Number })
  compareRates(
    @Query('destinationCountryId', ParseIntPipe) destinationCountryId: number,
    @Query('minutes', ParseIntPipe) minutes: number,
  ) {
    return this.calculationService.compareRates(destinationCountryId, minutes);
  }
}

