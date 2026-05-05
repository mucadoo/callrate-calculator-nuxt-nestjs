import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCallingRateDto {
  @ApiProperty({ example: 1, description: 'ID of the origin DDD' })
  @IsNumber()
  originDDDId: number;

  @ApiProperty({ example: 2, description: 'ID of the destination DDD' })
  @IsNumber()
  destinationDDDId: number;

  @ApiProperty({ example: 1.9, description: 'Rate per minute' })
  @IsNumber()
  @IsPositive()
  ratePerMin: number;
}
