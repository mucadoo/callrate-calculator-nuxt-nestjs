import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { DDDController } from './ddd.controller';
import { DDDService } from './ddd.service';

@Module({
  imports: [PrismaModule],
  controllers: [DDDController],
  providers: [DDDService],
})
export class DddModule {}
