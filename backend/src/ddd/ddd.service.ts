import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DDD } from '@prisma/client';
import { CreateDddDto } from './dto/create-ddd.dto';
import { UpdateDddDto } from './dto/update-ddd.dto';

@Injectable()
export class DDDService {
  constructor(private prisma: PrismaService) {}

  async create(createDddDto: CreateDddDto): Promise<DDD> {
    return this.prisma.dDD.create({
      data: createDddDto,
    });
  }

  async findAll(): Promise<DDD[]> {
    return this.prisma.dDD.findMany();
  }

  async findOne(id: number): Promise<DDD | null> {
    return this.prisma.dDD.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateDddDto: UpdateDddDto): Promise<DDD> {
    return this.prisma.dDD.update({
      where: { id },
      data: updateDddDto,
    });
  }

  async remove(id: number): Promise<DDD> {
    return this.prisma.dDD.delete({
      where: { id },
    });
  }
}
