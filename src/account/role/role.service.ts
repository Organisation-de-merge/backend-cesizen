import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoleDto } from './dto/role.create.dto';
import { UpdateRoleDto } from './dto/role.update.dto';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.role.findMany({
      where: {
        deletedAt: null,
        level: { not: 100 },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            isActive: true,
            roleId: true,
          },
        },
      },
    });
  }

  findAllActive() {
    return this.prisma.role.findMany({
      where: { 
        deletedAt: null,
        level: { not: 100 },
      },
      include: { 
        users: {
          select: {
            id: true,
            name: true,
            isActive: true,
            roleId: true,
          },
        },
      },
    });
  }

  findAllInactive() {
    return this.prisma.role.findMany({
      where: { 
        deletedAt: { not: null },
        level: { not: 100 },
      },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            isActive: true,
            roleId: true,
          },
        },
      },
    });
  }

  findById(id: number) {
    return this.prisma.role.findUnique({
      where: { id },
      include: {
        users: {
          select: {
            id: true,
            name: true,
            isActive: true,
            roleId: true,
          },
        },
      },
    });
  }

  create(dto: CreateRoleDto) {
    return this.prisma.role.create({
      data: {
        label: dto.label,
        level: dto.level,
      },
    });
  }

  update(id: number, dto: UpdateRoleDto) {
    return this.prisma.role.update({
      where: { id },
      data: dto,
    });
  }

  async disable(id: number) {
    const roleToDelete = await this.prisma.role.findUnique({
      where: { id },
    });
  
    if (!roleToDelete) {
      throw new Error(`Role ID ${id} introuvable`);
    }
  
    if (roleToDelete.label.toLowerCase() === 'utilisateur') {
      throw new Error("Impossible de supprimer le rôle 'Utilisateur'");
    }
  
    const fallbackRole = await this.prisma.role.findFirst({
      where: {
        label: {
          equals: 'Utilisateur',
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });
  
    if (!fallbackRole) {
      throw new Error("Rôle 'Utilisateur' non trouvé. Impossible de rétrograder les utilisateurs.");
    }
  
    await this.prisma.user.updateMany({
      where: {
        roleId: id,
      },
      data: {
        roleId: fallbackRole.id,
      },
    });
  
    return this.prisma.role.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    });
  }

  restore(id: number) {
    return this.prisma.role.update({
      where: { id },
      data: {
        deletedAt: null,
      },
    });
  }
}