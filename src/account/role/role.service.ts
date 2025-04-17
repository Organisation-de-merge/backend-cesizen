import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany({
      include: { users: true },
    });
  }

  findById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      include: { users: true },
    });
  }
}