import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PageStatus {
  DRAFT = 'DRAFT',
  HIDDEN = 'HIDDEN',
  PUBLISHED = 'PUBLISHED',
}

export class CreatePageDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  content: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty({ enum: PageStatus, default: PageStatus.DRAFT })
  @IsEnum(PageStatus)
  status: PageStatus;
}