import { Controller, Get, Post, Body, Patch, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { CallingRateService } from './calling-rate.service';
import { CreateCallingRateDto } from './dto/create-calling-rate.dto';
import { UpdateCallingRateDto } from './dto/update-calling-rate.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('calling-rate')
@Controller('calling-rate')
export class CallingRateController {
  constructor(private readonly callingRateService: CallingRateService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new calling rate' })
  create(@Body() createCallingRateDto: CreateCallingRateDto) {
    return this.callingRateService.create(createCallingRateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all calling rates' })
  findAll() {
    return this.callingRateService.findAll();
  }

  @Get('find')
  @ApiOperation({ summary: 'Find a calling rate by origin and destination DDD' })
  findByDDD(
    @Query('originDDDId', ParseIntPipe) originDDDId: number,
    @Query('destinationDDDId', ParseIntPipe) destinationDDDId: number,
  ) {
    return this.callingRateService.findByDDD(originDDDId, destinationDDDId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a calling rate by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.callingRateService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a calling rate' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateCallingRateDto: UpdateCallingRateDto) {
    return this.callingRateService.update(id, updateCallingRateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a calling rate' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.callingRateService.remove(id);
  }
}
