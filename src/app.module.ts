import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { AccountModule } from './account/account.module';
import { AuthModule } from './auth/auth.module';
import { InformationModule } from './information/information.module';

@Module({
  imports: [
    PrismaModule, 
    AccountModule, 
    AuthModule, 
    InformationModule
  ],
})
export class AppModule {}
