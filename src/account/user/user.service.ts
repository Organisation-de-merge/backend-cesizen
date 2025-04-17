import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { stat } from 'fs';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.user.findMany({
      include: { role: true },
    });
  }

  async findAllActive() {
    return this.prisma.user.findMany({
      where: { isActive: true },
      include: { role: true },
    });
  }

  async findAllInactive() {
    return this.prisma.user.findMany({
      where: { isActive: false },
      include: { role: true },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: { role: true },
    });
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
  
    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }
  
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
      throw new Error(`User with ID ${id} not found`);
    }
    if(user.isActive === true) {
      throw new Error(`User with ID ${id} is active and cannot be deleted`);
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
}