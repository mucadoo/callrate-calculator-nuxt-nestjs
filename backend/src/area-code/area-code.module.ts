import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { AreaCodeController } from './area-code.controller';
import { AreaCodeService } from './area-code.service';

@Module({
  imports: [PrismaModule],
  controllers: [AreaCodeController],
  providers: [AreaCodeService],
})
export class AreaCodeModule {}
