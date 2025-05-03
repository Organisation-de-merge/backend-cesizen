import { IsArray, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMenuDto {
  @ApiProperty()
  @IsString()
  label: string;

  @ApiProperty({ type: [Number] })
  @IsArray()
  pageIds: number[];
}