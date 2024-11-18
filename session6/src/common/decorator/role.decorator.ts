import { SetMetadata } from '@nestjs/common';
import { UserRoleTypes } from 'src/users/types/user-roles.types';

export const Roles = (...roles: UserRoleTypes[]) => SetMetadata('roles', roles);