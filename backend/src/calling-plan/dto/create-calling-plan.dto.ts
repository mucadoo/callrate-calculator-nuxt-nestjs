import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCallingPlanDto {
  @ApiProperty({ example: 'TalkMore 30', description: 'The name of the calling plan' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 30, description: 'Number of included minutes' })
  @IsNumber()
  @IsPositive()
  minutes: number;

  @ApiProperty({ example: 10, description: 'Percentage fee for exceeded minutes' })
  @IsNumber()
  @IsPositive()
  exceededMinutesPercent: number;
}
