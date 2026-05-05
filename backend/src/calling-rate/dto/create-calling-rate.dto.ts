import { IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCallingRateDto {
  @ApiProperty({ example: 1, description: 'ID of the destination country' })
  @IsNumber()
  destinationCountryId: number;

  @ApiProperty({ example: 1, description: 'ID of the calling plan' })
  @IsNumber()
  planId: number;

  @ApiProperty({ example: 1.9, description: 'Rate per minute' })
  @IsNumber()
  @IsPositive()
  ratePerMin: number;
}
