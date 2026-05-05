import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { CallingPlanService } from './calling-plan.service';
import { CreateCallingPlanDto } from './dto/create-calling-plan.dto';
import { UpdateCallingPlanDto } from './dto/update-calling-plan.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('calling-plan')
@Controller('calling-plan')
export class CallingPlanController {
  constructor(private readonly callingPlanService: CallingPlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calling plan' })
  create(@Body() createCallingPlanDto: CreateCallingPlanDto) {
    return this.callingPlanService.create(createCallingPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calling plans' })
  findAll() {
    return this.callingPlanService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a calling plan by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.callingPlanService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a calling plan' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCallingPlanDto: UpdateCallingPlanDto) {
    return this.callingPlanService.update(id, updateCallingPlanDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a calling plan' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.callingPlanService.remove(id);
  }
}
