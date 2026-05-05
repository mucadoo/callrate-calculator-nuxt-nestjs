import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ProviderService } from './provider.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@ApiTags('provider')
@Controller('provider')
export class ProviderController {
  constructor(private readonly providerService: ProviderService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new provider' })
  create(@Body() createProviderDto: CreateProviderDto) {
    return this.providerService.create(createProviderDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all providers' })
  findAll() {
    return this.providerService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a provider by id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.providerService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a provider' })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProviderDto: UpdateProviderDto) {
    return this.providerService.update(id, updateProviderDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a provider' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.providerService.remove(id);
  }
}
