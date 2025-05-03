import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

export const MIN_ROLE_LEVEL_KEY = 'minRoleLevel';
export const MinRoleLevel = (level: number) => SetMetadata(MIN_ROLE_LEVEL_KEY, level);