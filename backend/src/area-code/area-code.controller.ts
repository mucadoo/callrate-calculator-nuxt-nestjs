import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { AreaCodeService } from './area-code.service';
import { CreateAreaCodeDto } from './dto/create-area-code.dto';
import { UpdateAreaCodeDto } from './dto/update-area-code.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('area-code')
@Controller('area-code')
export class AreaCodeController {
  constructor(private readonly areaCodeService: AreaCodeService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new area code' })
  create(@Body() createAreaCodeDto: CreateAreaCodeDto) {
    return this.areaCodeService.create(createAreaCodeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all area codes' })
  findAll() {
    return this.areaCodeService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an area code by ID' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.areaCodeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an area code' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateAreaCodeDto: UpdateAreaCodeDto) {
    return this.areaCodeService.update(id, updateAreaCodeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an area code' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.areaCodeService.remove(id);
  }
}
