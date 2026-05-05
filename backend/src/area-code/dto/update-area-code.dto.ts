import { PartialType } from '@nestjs/swagger';
import { CreateAreaCodeDto } from './create-area-code.dto';

export class UpdateAreaCodeDto extends PartialType(CreateAreaCodeDto) {}
