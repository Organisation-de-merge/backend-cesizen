import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FavoriteService {
  constructor(private prisma: PrismaService) {}

  async add(userId: number, activityId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error(`Utilisateur ${userId} introuvable`);
  
    const activity = await this.prisma.activity.findUnique({ where: { id: activityId } });
    if (!activity) throw new Error(`Activité ${activityId} introuvable`);
  
    return this.prisma.favorite.upsert({
      where: {
        userId_activityId: {
          userId,
          activityId,
        },
      },
      update: {},
      create: {
        userId,
        activityId,
      },
    });
  }
  
  async remove(userId: number, activityId: number) {
    return this.prisma.favorite.delete({
      where: {
        userId_activityId: {
          userId,
          activityId,
        },
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.favorite.findMany({
      where: { userId },
      include: { activity: { include: { type: true } } },
    });
  }
}