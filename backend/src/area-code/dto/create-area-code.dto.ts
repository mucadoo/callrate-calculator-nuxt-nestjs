import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAreaCodeDto {
  @ApiProperty({ example: '11', description: 'The area code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
