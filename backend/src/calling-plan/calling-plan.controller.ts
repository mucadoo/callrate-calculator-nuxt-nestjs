import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CallingPlanService } from './calling-plan.service';

@Controller('calling-plan')
export class CallingPlanController {
  constructor(private readonly callingPlanService: CallingPlanService) {}

  @Get()
  findAll() {
    return this.callingPlanService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.callingPlanService.findOne(id);
  }
}
