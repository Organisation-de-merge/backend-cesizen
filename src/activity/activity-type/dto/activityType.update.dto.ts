import { PartialType } from '@nestjs/swagger';
import { CreateActivityTypeDto } from './activityType.create.dto';

export class UpdateActivityTypeDto extends PartialType(CreateActivityTypeDto) {}