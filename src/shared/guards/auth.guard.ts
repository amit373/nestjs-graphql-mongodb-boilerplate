import {
  Inject,
  Injectable,
  forwardRef,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@app/common';
import { Request } from 'express';
import { errorMessage } from '@app/constants';
import { IUser, UsersService } from '@app/modules';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (request) {
      if (!request?.headers?.authorization) {
        return false;
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      request.user = await this.validateToken(request);
      return true;
    } else {
      const ctx: any = GqlExecutionContext.create(context).getContext();

      if (!ctx?.req?.headers?.authorization) {
        return false;
      }

      // GRANT ACCESS TO PROTECTED ROUTE
      ctx.user = await this.validateToken(ctx.req);
      return true;
    }
  }

  async validateToken(req: Request): Promise<IUser> {
    let token: string | undefined = undefined;
    const { authorization } = req.headers;
    if (authorization && authorization.startsWith('Bearer')) {
      token = authorization.split(' ')[1];
    } else if (req.cookies?.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new UnauthorizedException(errorMessage.NOT_LOGGED_IN);
    }

    // 2) Verification token
    const decoded: any = await this.jwtService.verifyToken(token);

    if (!decoded || !decoded.id) {
      throw new UnauthorizedException(errorMessage.NOT_LOGGED_IN);
    }

    // 3) Check if user still exists
    const currentUser: any = await this.usersService.findById(decoded?.id);
    if (!currentUser || !currentUser?.ok) {
      throw new UnauthorizedException(errorMessage.USER_WITH_TOKEN_NOT_EXIST);
    }

    // Check if user changed password after the token was issued
    if (currentUser?.user?.changedPasswordAfter(decoded?.iat)) {
      throw new UnauthorizedException(errorMessage.RECENTLY_CHANGED_PASSWORD);
    }

    return currentUser.user as IUser;
  }
}
