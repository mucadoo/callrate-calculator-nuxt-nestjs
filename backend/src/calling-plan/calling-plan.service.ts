import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CallingPlan } from '@prisma/client';

@Injectable()
export class CallingPlanService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CallingPlan[]> {
    return this.prisma.callingPlan.findMany();
  }

  async findOne(id: number): Promise<CallingPlan | null> {
    return this.prisma.callingPlan.findUnique({
      where: { id },
    });
  }
}
