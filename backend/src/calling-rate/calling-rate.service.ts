import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CallingRate } from '@prisma/client';
import { CreateCallingRateDto } from './dto/create-calling-rate.dto';
import { UpdateCallingRateDto } from './dto/update-calling-rate.dto';

@Injectable()
export class CallingRateService {
  constructor(private prisma: PrismaService) {}

  async create(createCallingRateDto: CreateCallingRateDto): Promise<CallingRate> {
    return this.prisma.callingRate.create({
      data: createCallingRateDto,
    });
  }
async findAll(): Promise<CallingRate[]> {
  return this.prisma.callingRate.findMany({
    include: {
      destinationCountry: true,
      plan: {
        include: {
          provider: true,
        },
      },
    },
  });
}

async findOne(id: number): Promise<CallingRate | null> {
  return this.prisma.callingRate.findUnique({
    where: { id },
    include: {
      destinationCountry: true,
      plan: {
        include: {
          provider: true,
        },
      },
    },
  });
}


  async findByCountry(destinationCountryId: number): Promise<CallingRate[]> {
    return this.prisma.callingRate.findMany({
      where: { destinationCountryId },
      include: { plan: true },
    });
  }

  async update(id: number, updateCallingRateDto: UpdateCallingRateDto): Promise<CallingRate> {
    return this.prisma.callingRate.update({
      where: { id },
      data: updateCallingRateDto,
    });
  }

  async remove(id: number): Promise<CallingRate> {
    return this.prisma.callingRate.delete({
      where: { id },
    });
  }
}
