import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateActivityTypeDto {
  @ApiProperty()
  @IsString()
  label: string;
}