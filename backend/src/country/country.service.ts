import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';

@Injectable()
export class CountryService {
  constructor(private prisma: PrismaService) {}

  create(createCountryDto: CreateCountryDto) {
    return this.prisma.country.create({
      data: createCountryDto,
    });
  }

  findAll() {
    return this.prisma.country.findMany();
  }

  findOne(id: number) {
    return this.prisma.country.findUnique({
      where: { id },
      include: {
        rates: true,
      },
    });
  }

  update(id: number, updateCountryDto: UpdateCountryDto) {
    return this.prisma.country.update({
      where: { id },
      data: updateCountryDto,
    });
  }

  remove(id: number) {
    return this.prisma.country.delete({
      where: { id },
    });
  }
}
