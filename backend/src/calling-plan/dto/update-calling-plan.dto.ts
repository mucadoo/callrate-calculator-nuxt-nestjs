import { PartialType } from '@nestjs/swagger';
import { CreateCallingPlanDto } from './create-calling-plan.dto';

export class UpdateCallingPlanDto extends PartialType(CreateCallingPlanDto) {}
