import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from './dto/activity.create.dto';
import { UpdateActivityDto } from './dto/activity.update.dto';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: dto,
    });
  }

  findAll() {
    return this.prisma.activity.findMany({
      include: { type: true },
    });
  }

  findPublished() {
    return this.prisma.activity.findMany({
      where: { status: 'PUBLISHED' },
      include: { type: true },
    });
  }

  findOne(id: number) {
    return this.prisma.activity.findUnique({
      where: { id },
      include: { type: true },
    });
  }

  update(id: number, dto: UpdateActivityDto) {
    return this.prisma.activity.update({
      where: { id },
      data: dto,
    });
  }

  delete(id: number) {
    return this.prisma.activity.delete({
      where: { id },
    });
  }
}