import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CallingPlan } from '@prisma/client';
import { CreateCallingPlanDto } from './dto/create-calling-plan.dto';
import { UpdateCallingPlanDto } from './dto/update-calling-plan.dto';

@Injectable()
export class CallingPlanService {
  constructor(private prisma: PrismaService) {}

  async create(createCallingPlanDto: CreateCallingPlanDto): Promise<CallingPlan> {
    return this.prisma.callingPlan.create({
      data: createCallingPlanDto,
    });
  }

  async findAll(): Promise<CallingPlan[]> {
    return this.prisma.callingPlan.findMany();
  }

  async findOne(id: number): Promise<CallingPlan | null> {
    return this.prisma.callingPlan.findUnique({
      where: { id },
    });
  }

  async update(id: number, updateCallingPlanDto: UpdateCallingPlanDto): Promise<CallingPlan> {
    return this.prisma.callingPlan.update({
      where: { id },
      data: updateCallingPlanDto,
    });
  }

  async remove(id: number): Promise<CallingPlan> {
    return this.prisma.callingPlan.delete({
      where: { id },
    });
  }
}
