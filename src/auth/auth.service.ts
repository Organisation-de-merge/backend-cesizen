import { Injectable, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { MailService } from '../mail/mail.service';
import { addMinutes } from 'date-fns';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private mailService: MailService,
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
  
  private generateResetCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString(); 
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

  async forgotPassword(email: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Utilisateur non trouvé.');
  
    const resetCode = this.generateResetCode();
    const expiry = addMinutes(new Date(), 15);
  
    await this.prisma.user.update({
      where: { email },
      data: {
        resetToken: resetCode,
        resetTokenExpiry: expiry,
      },
    });
  
    await this.mailService.sendResetCode(email, resetCode);
      return { message: 'Code de réinitialisation envoyé par email.' };
    }

    async resetPassword(code: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: code,
        resetTokenExpiry: {
          gte: new Date(),
        },
      },
    });

    if (!user) {
      throw new BadRequestException('Code invalide ou expiré.');
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashed,
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return { message: 'Mot de passe réinitialisé avec succès.' };
  }
}