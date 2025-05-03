import { ApiProperty } from '@nestjs/swagger';
import { ActivityStatus } from './activity.create.dto';
import { ResponseActivityTypeDto } from '../../activity-type/dto/activityType.response.dto';

export class ResponseActivityDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ required: false })
  thumbnail?: string;

  @ApiProperty()
  duration: number;

  @ApiProperty()
  stressLevel: number;

  @ApiProperty({ enum: ActivityStatus })
  status: ActivityStatus;

  @ApiProperty()
  typeId: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  publicationDate?: Date;

  @ApiProperty({
    description: "Données du type d'activité",
    required: true,
    type: () => ResponseActivityTypeDto,
  })
  type: any;
}