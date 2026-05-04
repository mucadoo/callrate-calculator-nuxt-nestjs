import { Controller, Get, Query, ParseIntPipe } from '@nestjs/common';
import { CallingRateService } from './calling-rate.service';

@Controller('calling-rate')
export class CallingRateController {
  constructor(private readonly callingRateService: CallingRateService) {}

  @Get()
  findAll() {
    return this.callingRateService.findAll();
  }

  @Get('find')
  findByDDD(
    @Query('originDDDId', ParseIntPipe) originDDDId: number,
    @Query('destinationDDDId', ParseIntPipe) destinationDDDId: number,
  ) {
    return this.callingRateService.findByDDD(originDDDId, destinationDDDId);
  }
}
