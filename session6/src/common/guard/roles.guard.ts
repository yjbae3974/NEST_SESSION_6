import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRoleTypes } from 'src/users/types/user-roles.types';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRoleTypes[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    console.log(user);

    const matchRoles = (roles: UserRoleTypes[], userRole: UserRoleTypes) => {
      return roles.some((role) => role === userRole);
    };

    return matchRoles(roles, user.role);
  }
}
