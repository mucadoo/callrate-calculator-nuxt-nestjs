import { PartialType } from '@nestjs/swagger';
import { CreateCallingRateDto } from './create-calling-rate.dto';

export class UpdateCallingRateDto extends PartialType(CreateCallingRateDto) {}
