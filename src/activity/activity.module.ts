import { Module } from '@nestjs/common';
import { ActivityModule2 } from './activity/activity.module';
import { ActivityTypeModule } from './activity-type/activity-type.module';
import { FavoriteModule } from './favorite/favorite.module';

@Module({
  imports: [
    ActivityModule2, 
    ActivityTypeModule, 
    FavoriteModule]
})
export class ActivityModule {}
