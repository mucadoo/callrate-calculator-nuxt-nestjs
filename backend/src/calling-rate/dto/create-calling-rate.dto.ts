import { IsNumber, IsPositive, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCallingRateDto {
  @ApiProperty({ example: 1, description: 'ID of the destination country' })
  @IsNumber()
  destinationCountryId: number;

  @ApiProperty({ example: 1, description: 'ID of the provider', required: false })
  @IsNumber()
  @IsOptional()
  providerId?: number;

  @ApiProperty({ example: 1.9, description: 'Rate per minute' })
  @IsNumber()
  @IsPositive()
  ratePerMin: number;
}
