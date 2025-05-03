import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateActivityDto } from './dto/activity.create.dto';
import { UpdateActivityDto } from './dto/activity.update.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ActivityService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreateActivityDto) {
    return this.prisma.activity.create({
      data: dto,
    });
  }

  async findAll(
    query?: string,
    limit?: number,
    page: number = 1,
    typeId?: number,
    stressLevel?: number,
    status: string = 'PUBLISHED',
  ) {
    if (page < 1) {
      throw new BadRequestException('Le numéro de page doit être supérieur ou égal à 1.');
    }
  
    const filters: Prisma.ActivityWhereInput = {
      status: status.toUpperCase() as any,
      AND: [
        query
          ? {
              OR: [
                { name: { contains: query, mode: 'insensitive' as const } },
                { description: { contains: query, mode: 'insensitive' as const } },
              ],
            }
          : {},
        typeId !== undefined ? { typeId } : {},
        stressLevel !== undefined ? { stressLevel } : {},
      ],
    };
  
    if (!limit) {
      const allItems = await this.prisma.activity.findMany({
        where: filters,
        orderBy: { publicationDate: 'desc' },
        include: { type: true },
      });
  
      return {
        items: allItems,
        totalItems: allItems.length,
        pagination: null,
      };
    }
  
    const totalItems = await this.prisma.activity.count({ where: filters });
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;
  
    const items = await this.prisma.activity.findMany({
      where: filters,
      orderBy: { publicationDate: 'desc' },
      skip,
      take: limit,
      include: { type: true },
    });
  
    return {
      items,
      totalItems,
      pagination: {
        totalPages,
        currentPage,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  findLatest(limit: number) {
    return this.prisma.activity.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publicationDate: 'desc' },
      take: limit,
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