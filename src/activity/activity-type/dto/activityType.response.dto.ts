import { PartialType } from '@nestjs/swagger';
import { CreateActivityTypeDto } from './activityType.create.dto';

export class ResponseActivityTypeDto extends PartialType(CreateActivityTypeDto) {}