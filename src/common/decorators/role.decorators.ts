import { SetMetadata } from '@nestjs/common';
import { Role } from '../enums/role.enum';

export const ROLES_KEY = 'role';
export const RoleType = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
