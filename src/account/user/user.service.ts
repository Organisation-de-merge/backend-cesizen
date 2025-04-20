import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/user.create.dto';
import { UpdateUserDto } from './dto/user.update.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    const users = await this.prisma.user.findMany({
      where: {
        role: {
          level: {
            not: 100,
          },
        },
      },
      include: { role: true },
    });
  
    return users.map(user => ({
      id: user.id,
      name: user.name,
      roleId: user.roleId,
      role: user.role,
      isActive: user.isActive,
    }));
  }

  async findAllActive() {
    const users = await this.prisma.user.findMany({
      where: {
        isActive: true,
        role: {
          level: {
            not: 100,
          },
        },
      },
      include: { role: true },
    });
  
    return users.map(user => ({
      id: user.id,
      name: user.name,
      roleId: user.roleId,
      role: user.role,
      isActive: user.isActive,
    }));
  }

  async findAllInactive() {
    const users = await this.prisma.user.findMany({
      where: {
        isActive: false,
        role: {
          level: {
            not: 100,
          },
        },
      },
      include: { role: true },
    });
  
    return users.map(user => ({
      id: user.id,
      name: user.name,
      roleId: user.roleId,
      role: user.role,
      isActive: user.isActive,
    }));
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
  
    if (!user) {
      throw new Error(`L'utilisateur avec l\'Id ${id} n'existe pas`);
    }
  
    return {
      id: user.id,
      name: user.name,
      roleId: user.roleId,
      role: user.role,
      isActive: user.isActive,
    };
  }

  async create(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    return this.prisma.user.create({
      data: {
        email:dto.email,
        name: dto.name,
        password: hashedPassword,
        roleId: dto.roleId,
      },
    });
  }

  async update(id: number, dto: UpdateUserDto) {
    const data: any = { ...dto };
  
    return this.prisma.user.update({
      where: { id },
      data,
    });
  }
  
  async disable(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: false,
      },
    });
  }

  async restore(id: number) {
    return this.prisma.user.update({
      where: { id },
      data: {
        isActive: true,
      },
    });
  }

  async delete(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new Error(`L'utilisateur avec l\'Id ${id} n'existe pas`);
    }
    if(user.isActive === true) {
      throw new Error(`L'utilisateur avec l\'Id ${id} est actif et ne peut être supprimé`);
    }
    return this.prisma.user.update({
      where: { id },
      data: {
        name: "Utilisateur supprimé",
        email: "Utilisateur supprimé",
        password: "Utilisateur supprimé",
        deletedAt: new Date(),
      },
    });
  }

  async changePassword(userId: number, oldPassword: string, newPassword: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
  
    if (!user) {
      throw new Error("Utilisateur introuvable");
    }
  
    const match = await bcrypt.compare(oldPassword, user.password);
    if (!match) {
      throw new Error('Ancien mot de passe incorrect');
    }
  
    const newHash = await bcrypt.hash(newPassword, 10);
    return this.prisma.user.update({
      where: { id: userId },
      data: { password: newHash },
    });
  }
}