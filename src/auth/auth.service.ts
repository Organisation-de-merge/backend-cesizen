import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({
      where: { email },
      include: { role: true },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Identifiants invalides');
    }

    return user;
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      email: user.email,
      roleId: user.role.id,
      roleLabel: user.role.label,
      roleLevel: user.role.level,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(email: string, password: string, name: string) {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new BadRequestException('Cet email est déjà utilisé');

    const role = await this.prisma.role.findFirst({
      where: {
        label: {
          equals: 'Utilisateur',
          mode: 'insensitive',
        },
        deletedAt: null,
      },
    });

    if (!role) throw new BadRequestException("Le rôle 'Utilisateur' n'existe pas");

    const hash = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        name,
        password: hash,
        roleId: role.id,
      },
      include: { role: true },
    });

    return this.login(user);
  }
}