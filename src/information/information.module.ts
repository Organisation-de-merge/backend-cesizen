import { Module } from '@nestjs/common';
import { PageModule } from './page/page.module';
import { MenuModule } from './menu/menu.module';

@Module({
  imports: [
    PageModule, 
    MenuModule
  ]
})
export class InformationModule {}
