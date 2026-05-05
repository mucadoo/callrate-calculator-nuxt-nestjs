import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { DDDService } from './ddd.service';
import { CreateDddDto } from './dto/create-ddd.dto';
import { UpdateDddDto } from './dto/update-ddd.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('ddd')
@Controller('ddd')
export class DDDController {
  constructor(private readonly dddService: DDDService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new DDD' })
  create(@Body() createDddDto: CreateDddDto) {
    return this.dddService.create(createDddDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all DDDs' })
  findAll() {
    return this.dddService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a DDD by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.dddService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a DDD' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateDddDto: UpdateDddDto) {
    return this.dddService.update(id, updateDddDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a DDD' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.dddService.remove(id);
  }
}
