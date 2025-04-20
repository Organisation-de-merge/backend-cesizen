import { PartialType } from '@nestjs/swagger';
import { CreatePageDto } from './page.create.dto';

export class ResponsePageDto extends PartialType(CreatePageDto) {}