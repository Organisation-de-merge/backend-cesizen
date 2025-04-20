import { PartialType } from '@nestjs/swagger';
import { CreatePageDto } from './page.create.dto';

export class UpdatePageDto extends PartialType(CreatePageDto) {}