import { Controller, Get, Param } from '@nestjs/common';
import { DDDService } from './ddd.service';

@Controller('ddd')
export class DDDController {
  constructor(private readonly dddService: DDDService) {}

  @Get()
  findAll() {
    return this.dddService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.dddService.findOne(+id);
  }
}
