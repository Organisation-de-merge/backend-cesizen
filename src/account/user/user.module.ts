import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController, ProfileController } from './user.controller';

@Module({
  controllers: [UserController, ProfileController],
  providers: [UserService],
})
export class UserModule {}