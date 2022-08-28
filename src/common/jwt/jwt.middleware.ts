import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { JwtService } from '.';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService, // private readonly userService: UserService,
  ) {}

  async use(req: Request, _: Response, next: NextFunction): Promise<void> {
    const token = req.headers['authorization'];
    try {
      const decoded = this.jwtService.verifyToken(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        //   const { user, ok } = await this.userService.findById(decoded['id']);
        //   if (ok) {
        //     req['user'] = user;
        //   }
      }
    } catch (e) {
      throw new UnauthorizedException();
    }
    next();
  }
}
