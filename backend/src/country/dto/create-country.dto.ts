import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({ example: 'Brazil' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: '55' })
  @IsNotEmpty()
  @IsString()
  phoneCode: string;
}
