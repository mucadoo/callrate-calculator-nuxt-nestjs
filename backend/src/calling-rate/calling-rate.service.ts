import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CallingRate } from '@prisma/client';

@Injectable()
export class CallingRateService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<CallingRate[]> {
    return this.prisma.callingRate.findMany({
      include: {
        originDDD: true,
        destinationDDD: true,
      },
    });
  }

  async findByDDD(originDDDId: number, destinationDDDId: number): Promise<CallingRate | null> {
    return this.prisma.callingRate.findFirst({
      where: {
        originDDDId,
        destinationDDDId,
      },
    });
  }
}
