import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityTypeDto } from './dto/activityType.create.dto';
import { UpdateActivityTypeDto } from './dto/activityType.update.dto';
import { ResponseActivityTypeDto } from './dto/activityType.response.dto';

@Injectable()
export class ActivityTypeService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateActivityTypeDto) {
    return this.prisma.activityType.create({ data: dto });
  }

  findAll() {
    return this.prisma.activityType.findMany();
  }

  findOne(id: number) {
    return this.prisma.activityType.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdateActivityTypeDto) {
    return this.prisma.activityType.update({ where: { id }, data: dto });
  }

  delete(id: number) {
    return this.prisma.activityType.delete({ where: { id } });
  }
}