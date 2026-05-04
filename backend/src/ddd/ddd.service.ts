import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DDD } from '@prisma/client';

@Injectable()
export class DDDService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<DDD[]> {
    return this.prisma.dDD.findMany();
  }

  async findOne(id: number): Promise<DDD | null> {
    return this.prisma.dDD.findUnique({
      where: { id },
    });
  }
}
