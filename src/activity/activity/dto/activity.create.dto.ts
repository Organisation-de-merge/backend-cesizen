import { IsEnum, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum ActivityStatus {
  DRAFT = 'DRAFT',
  HIDDEN = 'HIDDEN',
  PUBLISHED = 'PUBLISHED',
}

export class CreateActivityDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiProperty()
  @IsInt()
  duration: number;

  @ApiProperty()
  @IsInt()
  stressLevel: number;

  @ApiProperty({ enum: ActivityStatus, default: ActivityStatus.DRAFT })
  @IsEnum(ActivityStatus)
  status: ActivityStatus;

  @ApiProperty()
  @IsInt()
  typeId: number;

  @ApiProperty({ required: false })
  @IsOptional()
  publicationDate?: Date;
}