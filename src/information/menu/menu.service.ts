import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMenuDto } from './dto/menu.create.dto';
import { UpdateMenuDto } from './dto/menu.update.dto';

@Injectable()
export class MenuService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateMenuDto) {
    return this.prisma.informationMenu.create({ data: dto });
  }

  findAll() {
    return this.prisma.informationMenu.findMany();
  }

  async findById(id: number) {
    const menu = await this.prisma.informationMenu.findUnique({
      where: { id },
    });

    if (!menu) return null;

    const pages = await this.prisma.informationPage.findMany({
      where: {
        id: { in: menu.pageIds },
      },
    });

    return {
      ...menu,
      pages,
    };
  }

  update(id: number, dto: UpdateMenuDto) {
    return this.prisma.informationMenu.update({
      where: { id },
      data: dto,
    });
  }

  delete(id: number) {
    return this.prisma.informationMenu.delete({ where: { id } });
  }
}