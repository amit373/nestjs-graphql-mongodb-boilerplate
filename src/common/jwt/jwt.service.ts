import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload, sign, verify } from 'jsonwebtoken';

@Injectable()
export class JwtService {
  constructor(private readonly configService: ConfigService) {}

  signToken(userId: string): string {
    return sign(
      { id: userId },
      this.configService.get<string>('jwt.secretKey'),
      {
        expiresIn: this.configService.get<string>('jwt.expiresIn'),
      },
    );
  }

  verifyToken(token: string): string | JwtPayload {
    return verify(token, this.configService.get<string>('jwt.secretKey'));
  }
}
