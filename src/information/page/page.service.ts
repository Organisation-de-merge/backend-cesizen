import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePageDto } from './dto/page.create.dto';
import { UpdatePageDto } from './dto/page.update.dto';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePageDto) {
    const data: any = { ...dto };
  
    if (dto.status?.toUpperCase() === 'PUBLISHED') {
      data.publishedAt = new Date();
    }
  
    return this.prisma.informationPage.create({ data });
  }

  async findAll(
    query?: string,
    limit?: number,
    page: number = 1,
    status: string = 'PUBLISHED',
  ) {
    if (page < 1) {
      throw new BadRequestException('Le numéro de page doit être supérieur ou égal à 1.');
    }

    const filters = {
      status: status.toUpperCase() as any,
      ...(query && {
        OR: [
          { title: { contains: query, mode: 'insensitive' as const } },
          { content: { contains: query, mode: 'insensitive' as const } },
        ],
      }),
    };

    if (!limit) {
      const allItems = await this.prisma.informationPage.findMany({
        where: filters,
        orderBy: { publishedAt: 'desc' },
      });

      return {
        items: allItems,
        totalItems: allItems.length,
        pagination: null,
      };
    }

    const totalItems = await this.prisma.informationPage.count({ where: filters });
    const totalPages = Math.max(1, Math.ceil(totalItems / limit));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * limit;

    const items = await this.prisma.informationPage.findMany({
      where: filters,
      orderBy: { publishedAt: 'desc' },
      skip,
      take: limit,
    });

    return {
      items,
      totalItems,
      pagination: {
        totalPages,
        currentPage,
        limit,
        hasNextPage: currentPage < totalPages,
        hasPreviousPage: currentPage > 1,
      },
    };
  }

  findLatest(limit: number) {
    return this.prisma.informationPage.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { publishedAt: 'asc' },
      take: limit,
    });
  }

  findById(id: number) {
    return this.prisma.informationPage.findUnique({ where: { id } });
  }

  update(id: number, dto: UpdatePageDto) {
    return this.prisma.informationPage.update({
      where: { id },
      data: dto,
    });
  }

  delete(id: number) {
    return this.prisma.informationPage.delete({ where: { id } });
  }
}