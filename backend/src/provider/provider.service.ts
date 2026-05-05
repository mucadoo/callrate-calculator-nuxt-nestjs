import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProviderDto } from './dto/create-provider.dto';
import { UpdateProviderDto } from './dto/update-provider.dto';

@Injectable()
export class ProviderService {
  constructor(private prisma: PrismaService) {}

  create(createProviderDto: CreateProviderDto) {
    return this.prisma.provider.create({
      data: createProviderDto,
    });
  }

  findAll() {
    return this.prisma.provider.findMany({
      include: {
        _count: {
          select: { 
            callingRates: true,
            callingPlans: true,
          },
        },
      },
    });
  }

  findOne(id: number) {
    return this.prisma.provider.findUnique({
      where: { id },
      include: {
        callingPlans: true,
        callingRates: true,
      },
    });
  }

  update(id: number, updateProviderDto: UpdateProviderDto) {
    return this.prisma.provider.update({
      where: { id },
      data: updateProviderDto,
    });
  }

  remove(id: number) {
    return this.prisma.provider.delete({
      where: { id },
    });
  }
}
