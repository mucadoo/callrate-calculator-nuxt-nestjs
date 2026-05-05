import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProviderDto {
  @ApiProperty({ example: 'GlobalTalk' })
  @IsNotEmpty()
  @IsString()
  name: string;
}
