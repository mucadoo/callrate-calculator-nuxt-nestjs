import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDddDto {
  @ApiProperty({ example: '11', description: 'The DDD code' })
  @IsString()
  @IsNotEmpty()
  code: string;
}
