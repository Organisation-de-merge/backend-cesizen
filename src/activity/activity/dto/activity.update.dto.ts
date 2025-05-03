import { PartialType } from '@nestjs/swagger';
import { CreateActivityDto } from './activity.create.dto';

export class UpdateActivityDto extends PartialType(CreateActivityDto) {}