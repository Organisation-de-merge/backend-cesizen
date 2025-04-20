import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePageDto } from './dto/page.create.dto';
import { UpdatePageDto } from './dto/page.update.dto';

@Injectable()
export class PageService {
  constructor(private prisma: PrismaService) {}

  create(dto: CreatePageDto) {
    return this.prisma.informationPage.create({ data: dto });
  }

  findAll() {
    return this.prisma.informationPage.findMany();
  }

  findPublished() {
    return this.prisma.informationPage.findMany({
      where: { status: 'PUBLISHED' },
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