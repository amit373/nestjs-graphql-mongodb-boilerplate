import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles: string[] = this.reflector.get<string[]>(
      'roles',
      context.getHandler(),
    );
    if (!roles) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context).getContext();
    const user = ctx?.user;

    if (!roles || !user) {
      return true;
    }

    return roles.includes(user.role);
  }
}
