import { Module } from '@nestjs/common';
import { ActivityTypeService } from './activity-type.service';
import { ActivityTypeController } from './activity-type.controller';

@Module({
  providers: [ActivityTypeService],
  controllers: [ActivityTypeController]
})
export class ActivityTypeModule {}
