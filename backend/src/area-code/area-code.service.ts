import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AreaCode } from '@prisma/client';
import { CreateAreaCodeDto } from './dto/create-area-code.dto';
import { UpdateAreaCodeDto } from './dto/update-area-code.dto';

@Injectable()
export class AreaCodeService {
  constructor(private prisma: PrismaService) {}

  async create(createAreaCodeDto: CreateAreaCodeDto): Promise<AreaCode> {
    return this.prisma.areaCode.create({
      data: createAreaCodeDto,
    });
  }

  async findAll(): Promise<AreaCode[]> {
    return this.prisma.areaCode.findMany();
  }

  async findOne(id: number): Promise<AreaCode | null> {
    return this.prisma.areaCode.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateAreaCodeDto: UpdateAreaCodeDto): Promise<AreaCode> {
    return this.prisma.areaCode.update({
      where: { id },
      data: updateAreaCodeDto,
    });
  }

  async remove(id: number): Promise<AreaCode> {
    return this.prisma.areaCode.delete({
      where: { id },
    });
  }
}
