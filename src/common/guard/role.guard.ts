import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY, MIN_ROLE_LEVEL_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler());
    const minLevel = this.reflector.get<number>(MIN_ROLE_LEVEL_KEY, context.getHandler());

    const { user } = context.switchToHttp().getRequest();
    if (!user) throw new ForbiddenException('Utilisateur non authentifié');

    if (requiredRoles && !requiredRoles.includes(user.roleLabel)) {
      throw new ForbiddenException('Rôle non autorisé');
    }

    if (minLevel !== undefined && user.roleLevel < minLevel) {
      throw new ForbiddenException('Niveau de permission insuffisant');
    }

    return true;
  }
}